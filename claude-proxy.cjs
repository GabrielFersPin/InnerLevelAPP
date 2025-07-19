const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/openai', async (req, res) => {
  try {
    const { model, messages, ...rest } = req.body;
    const completion = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages,
      ...rest // allow temperature, max_tokens, etc.
    });
    res.json(completion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Diagnostic endpoint to verify fetch works (optional)
app.get('/api/fetch-test', async (req, res) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`)); 