const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
const Stripe = require("stripe");
require('dotenv').config();

const app = express();
const port = 5000;

// Simple in-file usage store (can be replaced with DB)
const { getUserUsage, incrementUserUsage } = require('./usageStore');

// Basic config
const MONTHLY_GENERATION_LIMIT = parseInt(process.env.MONTHLY_GENERATION_LIMIT || '8', 10); // per user
const MAX_TOKENS_PER_REQUEST = parseInt(process.env.MAX_TOKENS_PER_REQUEST || '2000', 10);
const MONTHLY_TOKEN_LIMIT = parseInt(process.env.MONTHLY_TOKEN_LIMIT || '100000', 10);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// OpenAI Configuration (API nueva v4+)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for OpenAI Chat Completions (API nueva)
app.post("/api/openai", async (req, res) => {
  const { model, messages, temperature, max_tokens, userId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  // Require a userId to enforce per-user quotas
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // Check monthly quota
  const usage = getUserUsage(userId);
  if (usage.generations >= MONTHLY_GENERATION_LIMIT) {
    return res.status(402).json({
      error: {
        code: 'quota_exceeded',
        message: 'Monthly AI generation quota reached. Please wait until next month or upgrade your plan.'
      }
    });
  }

  try {
    console.log('📞 Calling OpenAI API...');
    
    const completion = await openai.chat.completions.create({
      model: model || "gpt-4o-mini", // Modelo más económico
      messages: messages,
      temperature: temperature || 0.7,
      max_tokens: Math.min(max_tokens || 300, MAX_TOKENS_PER_REQUEST),
    });

    console.log('✅ OpenAI API response received');
    // Record usage (1 generation + tokens)
    const usedTokens = completion.usage?.total_tokens || 0;
    const after = incrementUserUsage(userId, { generations: 1, tokens: usedTokens });

    res.status(200).json({
      choices: completion.choices,
      usage: completion.usage,
      model: completion.model,
      quota: { limit: MONTHLY_GENERATION_LIMIT, used: after.generations, period: after.period },
      tokenQuota: { limit: MONTHLY_TOKEN_LIMIT, used: after.tokens }
    });
  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error.message);
    res.status(500).json({ 
      error: {
        message: error.message || "Failed to call OpenAI API",
        type: error.type || "api_error"
      }
    });
  }
});

// Usage endpoint
app.get('/api/usage', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  const usage = getUserUsage(userId);
  res.json({
    period: usage.period,
    generations: { used: usage.generations, limit: MONTHLY_GENERATION_LIMIT },
    tokens: { used: usage.tokens, limit: MONTHLY_TOKEN_LIMIT }
  });
});

// Create Stripe Checkout Session (subscription)
app.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured on the server' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const lookupKeyFromBody = req.body.lookup_key;
    const priceIdFromEnv = process.env.STRIPE_PRICE_ID;

    let priceId = priceIdFromEnv || null;

    if (!priceId && lookupKeyFromBody) {
      const prices = await stripe.prices.list({
        lookup_keys: [lookupKeyFromBody],
        expand: ['data.product']
      });
      if (!prices.data || prices.data.length === 0) {
        return res.status(400).json({ error: 'Invalid lookup_key: price not found' });
      }
      priceId = prices.data[0].id;
    }

    if (!priceId) {
      return res.status(400).json({ error: 'Missing STRIPE_PRICE_ID or lookup_key' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: `${frontendUrl}?page=payment-success` + `&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}?page=ai-card-generator`,
    });

    return res.redirect(303, session.url);
  } catch (error) {
    console.error('Stripe session error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Also support GET for convenience (e.g., direct links)
app.get('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe is not configured on the server' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const lookupKeyFromQuery = req.query.lookup_key;
    const priceIdFromEnv = process.env.STRIPE_PRICE_ID;

    let priceId = priceIdFromEnv || null;

    if (!priceId && lookupKeyFromQuery) {
      const prices = await stripe.prices.list({
        lookup_keys: [lookupKeyFromQuery],
        expand: ['data.product']
      });
      if (!prices.data || prices.data.length === 0) {
        return res.status(400).json({ error: 'Invalid lookup_key: price not found' });
      }
      priceId = prices.data[0].id;
    }

    if (!priceId) {
      return res.status(400).json({ error: 'Missing STRIPE_PRICE_ID or lookup_key' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: `${frontendUrl}?page=payment-success` + `&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}?page=ai-card-generator`,
    });

    return res.redirect(303, session.url);
  } catch (error) {
    console.error('Stripe session error (GET):', error);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Stripe webhook endpoint for successful payments
app.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // For development, parse the body directly
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Payment successful for session:', session.id);
    
    // Here you would typically:
    // 1. Extract user ID from session metadata
    // 2. Reset their quota or upgrade their plan
    // 3. Send confirmation email
    
    // For now, we'll just log it
    console.log('Customer email:', session.customer_details?.email);
  }

  res.json({received: true});
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development"
  });
});

// Test endpoint
app.get("/test", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say 'API working!'" }],
      max_tokens: 10,
    });

    res.status(200).json({ 
      status: "Test successful",
      response: completion.choices[0].message.content 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "Test failed",
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${port}/test`);
  
  // Verificar que la API key esté configurada
  if (!process.env.OPENAI_API_KEY) {
    console.error('⚠️  WARNING: OPENAI_API_KEY not found in environment variables');
  } else {
    console.log('✅ OpenAI API key loaded');
  }
});