const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// OpenAI Configuration (API nueva v4+)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for OpenAI Chat Completions (API nueva)
app.post("/api/openai", async (req, res) => {
  const { model, messages, temperature, max_tokens } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    console.log('📞 Calling OpenAI API...');
    
    const completion = await openai.chat.completions.create({
      model: model || "gpt-4o-mini", // Modelo más económico
      messages: messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1500,
    });

    console.log('✅ OpenAI API response received');
    
    res.status(200).json({
      choices: completion.choices,
      usage: completion.usage,
      model: completion.model
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