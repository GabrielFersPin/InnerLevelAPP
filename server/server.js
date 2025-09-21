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

// Logging inicial mejorado
console.log('\n🚀 === INNERLEVEL SERVER STARTING ===');
console.log('📍 Working directory:', __dirname);
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
console.log('🌐 Frontend URL:', process.env.FRONTEND_URL || process.env.CLIENT_URL);
console.log('📊 OpenAI configured:', !!process.env.OPENAI_API_KEY);
console.log('💳 Stripe configured:', !!process.env.STRIPE_SECRET_KEY);
console.log('🔑 Stripe format valid:', process.env.STRIPE_SECRET_KEY ? 
  (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') || 
   process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) : false);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS mejorado para tu estructura
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5176',
    process.env.CLIENT_URL || 'http://localhost:5176',
    'http://localhost:3000', // Por si acaso
    'http://localhost:5173'  // Vite default
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de logging mejorado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  
  if (req.method === 'POST' && req.body && Object.keys(req.body).length > 0) {
    // Log body pero oculta información sensible
    const logBody = { ...req.body };
    if (logBody.messages) {
      logBody.messages = `[${logBody.messages.length} messages]`;
    }
    console.log('📝 Request body:', JSON.stringify(logBody, null, 2));
  }
  next();
});

// Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// OpenAI Configuration (API nueva v4+)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== NUEVO: Debug configuration endpoint =====
app.get('/debug/config', (req, res) => {
  console.log('🔍 Debug config requested');
  
  const stripeValidFormat = process.env.STRIPE_SECRET_KEY ? 
    (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') || 
     process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) : false;

  res.json({
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: port,
      FRONTEND_URL: process.env.FRONTEND_URL,
      CLIENT_URL: process.env.CLIENT_URL,
      MONTHLY_GENERATION_LIMIT,
      MAX_TOKENS_PER_REQUEST,
      MONTHLY_TOKEN_LIMIT
    },
    services: {
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        keyPreview: process.env.OPENAI_API_KEY ? 
          process.env.OPENAI_API_KEY.substring(0, 10) + '...' : null
      },
      stripe: {
        configured: !!process.env.STRIPE_SECRET_KEY,
        keyPreview: process.env.STRIPE_SECRET_KEY ? 
          process.env.STRIPE_SECRET_KEY.substring(0, 15) + '...' : null,
        validFormat: stripeValidFormat,
        priceId: process.env.STRIPE_PRICE_ID || 'not_set'
      },
      usageStore: {
        available: true,
        type: 'in-memory'
      }
    },
    workingDirectory: __dirname,
    envFile: {
      exists: require('fs').existsSync('.env'),
      path: require('path').resolve('.env')
    },
    validation: {
      issues: [
        ...(!process.env.OPENAI_API_KEY ? ['OpenAI API key not configured'] : []),
        ...(!process.env.STRIPE_SECRET_KEY ? ['Stripe secret key not configured'] : []),
        ...(process.env.STRIPE_SECRET_KEY && !stripeValidFormat ? ['Stripe secret key has invalid format'] : []),
        ...(!process.env.STRIPE_PRICE_ID ? ['Stripe price ID not configured'] : [])
      ]
    }
  });
});

// Endpoint for OpenAI Chat Completions (API nueva)
app.post("/api/openai", async (req, res) => {
  const { model, messages, temperature, max_tokens, userId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ 
      success: false,
      error: "Messages array is required",
      code: 'MISSING_MESSAGES'
    });
  }

  // Require a userId to enforce per-user quotas
  if (!userId) {
    return res.status(400).json({ 
      success: false,
      error: "userId is required",
      code: 'MISSING_USER_ID'
    });
  }

  // Check monthly quota
  const usage = getUserUsage(userId);
  if (usage.generations >= MONTHLY_GENERATION_LIMIT) {
    return res.status(402).json({
      success: false,
      error: 'Monthly AI generation quota reached. Please wait until next month or upgrade your plan.',
      code: 'QUOTA_EXCEEDED',
      quota: { 
        used: usage.generations, 
        limit: MONTHLY_GENERATION_LIMIT, 
        period: usage.period 
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
      success: true,
      choices: completion.choices,
      usage: completion.usage,
      model: completion.model,
      quota: { limit: MONTHLY_GENERATION_LIMIT, used: after.generations, period: after.period },
      tokenQuota: { limit: MONTHLY_TOKEN_LIMIT, used: after.tokens }
    });
  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error.message);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to call OpenAI API",
      code: 'OPENAI_ERROR',
      type: error.type || "api_error"
    });
  }
});

// Usage endpoint
app.get('/api/usage', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ 
      success: false,
      error: 'userId is required',
      code: 'MISSING_USER_ID'
    });
  }
  const usage = getUserUsage(userId);
  res.json({
    success: true,
    period: usage.period,
    generations: { used: usage.generations, limit: MONTHLY_GENERATION_LIMIT },
    tokens: { used: usage.tokens, limit: MONTHLY_TOKEN_LIMIT }
  });
});

// Create Stripe Checkout Session (subscription) - MEJORADO
app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('💳 Stripe checkout session requested');
    console.log('📝 Request body:', req.body);

    if (!stripe) {
      console.error('❌ Stripe not configured. Please set STRIPE_SECRET_KEY in server/.env file');
      return res.status(500).json({ 
        success: false,
        error: 'Stripe is not configured on the server',
        code: 'STRIPE_NOT_CONFIGURED',
        details: 'Please set STRIPE_SECRET_KEY in server/.env file'
      });
    }

    // Verificar formato de clave
    if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') && 
        !process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      return res.status(500).json({
        success: false,
        error: 'Invalid Stripe key format',
        code: 'STRIPE_INVALID_KEY',
        details: 'Key must start with sk_test_ or sk_live_',
        currentFormat: process.env.STRIPE_SECRET_KEY.substring(0, 15) + '...'
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5176';
    const lookupKeyFromBody = req.body.lookup_key;
    const priceIdFromBody = req.body.priceId; // Nuevo: soporte para priceId directo
    const priceIdFromEnv = process.env.STRIPE_PRICE_ID;

    let priceId = priceIdFromBody || priceIdFromEnv || null;

    if (!priceId && lookupKeyFromBody) {
      const prices = await stripe.prices.list({
        lookup_keys: [lookupKeyFromBody],
        expand: ['data.product']
      });
      if (!prices.data || prices.data.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid lookup_key: price not found',
          code: 'INVALID_LOOKUP_KEY'
        });
      }
      priceId = prices.data[0].id;
    }

    if (!priceId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing STRIPE_PRICE_ID, priceId, or lookup_key',
        code: 'MISSING_PRICE_ID'
      });
    }

    console.log('📊 Creating session with:', {
      priceId,
      frontendUrl,
      userId: req.body.userId || 'not_provided'
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}`,
      metadata: {
        ...(req.body.userId && { userId: req.body.userId })
      },
      ...(req.body.email && { customer_email: req.body.email })
    });

    console.log('✅ Stripe session created successfully:', session.id);

    // Para compatibilidad con tu frontend actual, devolver tanto redirect como JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        sessionId: session.id,
        url: session.url
      });
    } else {
      return res.redirect(303, session.url);
    }
  } catch (error) {
    console.error('❌ Stripe session error:', error);
    
    let statusCode = 500;
    let errorCode = 'STRIPE_ERROR';

    // Handle specific Stripe errors
    if (error.type === 'StripeAuthenticationError') {
      statusCode = 401;
      errorCode = 'STRIPE_AUTH_ERROR';
    } else if (error.type === 'StripeInvalidRequestError') {
      statusCode = 400;
      errorCode = 'STRIPE_INVALID_REQUEST';
    }

    return res.status(statusCode).json({ 
      success: false,
      error: error.message || 'Failed to create checkout session',
      code: errorCode,
      type: error.type,
      details: 'Please check your Stripe configuration'
    });
  }
});

// Also support GET for convenience (e.g., direct links)
app.get('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ 
        success: false,
        error: 'Stripe is not configured on the server',
        code: 'STRIPE_NOT_CONFIGURED'
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5176';
    const lookupKeyFromQuery = req.query.lookup_key;
    const priceIdFromEnv = process.env.STRIPE_PRICE_ID;

    let priceId = priceIdFromEnv || null;

    if (!priceId && lookupKeyFromQuery) {
      const prices = await stripe.prices.list({
        lookup_keys: [lookupKeyFromQuery],
        expand: ['data.product']
      });
      if (!prices.data || prices.data.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid lookup_key: price not found',
          code: 'INVALID_LOOKUP_KEY'
        });
      }
      priceId = prices.data[0].id;
    }

    if (!priceId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing STRIPE_PRICE_ID or lookup_key',
        code: 'MISSING_PRICE_ID'
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}`,
    });

    return res.redirect(303, session.url);
  } catch (error) {
    console.error('Stripe session error (GET):', error);
    
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to create checkout session',
      code: 'STRIPE_ERROR',
      details: 'Please check your Stripe configuration'
    });
  }
});

// Verify payment endpoint
app.post('/verify-payment', async (req, res) => {
  try {
    const { session_id } = req.body;
    
    if (!session_id) {
      return res.status(400).json({ 
        success: false,
        error: 'session_id is required',
        code: 'MISSING_SESSION_ID'
      });
    }

    if (!stripe) {
      return res.status(500).json({ 
        success: false,
        error: 'Stripe is not configured',
        code: 'STRIPE_NOT_CONFIGURED'
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      console.log('✅ Payment verified successfully for session:', session_id);
      
      // Aquí puedes agregar lógica adicional como:
      // - Actualizar la base de datos del usuario
      // - Resetear quotas
      // - Enviar email de confirmación
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        session: {
          id: session.id,
          payment_status: session.payment_status,
          customer_email: session.customer_details?.email,
          amount_total: session.amount_total
        }
      });
    } else {
      console.log('❌ Payment not completed for session:', session_id);
      res.status(400).json({ 
        success: false,
        error: 'Payment not completed',
        code: 'PAYMENT_NOT_COMPLETED',
        payment_status: session.payment_status 
      });
    }
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to verify payment',
      code: 'PAYMENT_VERIFICATION_ERROR',
      details: error.message 
    });
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

// Health check endpoint - MEJORADO
app.get("/health", (req, res) => {
  const stripeValidFormat = process.env.STRIPE_SECRET_KEY ? 
    (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') || 
     process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) : false;

  const healthData = {
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    port: port,
    services: {
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        keyFormat: process.env.OPENAI_API_KEY ? 
          process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'NOT_SET'
      },
      stripe: {
        configured: !!process.env.STRIPE_SECRET_KEY,
        keyFormat: process.env.STRIPE_SECRET_KEY ? 
          process.env.STRIPE_SECRET_KEY.substring(0, 15) + '...' : 'NOT_SET',
        validFormat: stripeValidFormat
      }
    },
    frontend: {
      url: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'NOT_SET'
    }
  };

  // Determinar si hay problemas
  const issues = [];
  if (!process.env.OPENAI_API_KEY) {
    issues.push('OpenAI API key not configured');
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    issues.push('Stripe secret key not configured');
  } else if (!stripeValidFormat) {
    issues.push('Stripe secret key has invalid format');
  }

  if (issues.length > 0) {
    healthData.status = 'WARNING';
    healthData.issues = issues;
  }

  res.status(200).json(healthData);
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

// 404 handler para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      'GET /health',
      'GET /debug/config',
      'GET /test',
      'POST /api/openai',
      'GET /api/usage',
      'POST /create-checkout-session',
      'GET /create-checkout-session',
      'POST /verify-payment',
      'POST /stripe-webhook'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled server error:', error);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start the server
app.listen(port, () => {
  console.log(`\n✅ === SERVER STARTED SUCCESSFULLY ===`);
  console.log(`🌐 Server running at: http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Debug config: http://localhost:${port}/debug/config`);
  console.log(`🧪 Test endpoint: http://localhost:${port}/test`);
  console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5176'}`);
  
  console.log('\n📋 Available endpoints:');
  console.log('   GET  /health');
  console.log('   GET  /debug/config');
  console.log('   GET  /test');
  console.log('   POST /api/openai');
  console.log('   GET  /api/usage');
  console.log('   POST /create-checkout-session');
  console.log('   POST /verify-payment');
  
  console.log('\n🧪 Quick tests:');
  console.log(`   curl http://localhost:${port}/health`);
  console.log(`   curl http://localhost:${port}/debug/config`);
  console.log('=======================================\n');
  
  // Verificar que la API key esté configurada
  if (!process.env.OPENAI_API_KEY) {
    console.error('⚠️  WARNING: OPENAI_API_KEY not found in environment variables');
  } else {
    console.log('✅ OpenAI API key loaded');
  }
  
  // Verificar configuración de Stripe
  if (!stripe) {
    console.error('⚠️  WARNING: Stripe not configured');
    console.error('   Please create server/.env file with:');
    console.error('   STRIPE_SECRET_KEY=sk_test_your_key_here');
    console.error('   STRIPE_PRICE_ID=price_your_price_id_here');
  } else {
    const stripeValidFormat = process.env.STRIPE_SECRET_KEY ? 
      (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') || 
       process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) : false;
    
    if (stripeValidFormat) {
      console.log('✅ Stripe configured with valid key format');
    } else {
      console.error('⚠️  WARNING: Stripe key has invalid format');
      console.error('   Key must start with sk_test_ or sk_live_');
      console.error('   Current format:', process.env.STRIPE_SECRET_KEY.substring(0, 15) + '...');
    }
  }
});