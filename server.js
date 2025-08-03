const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// OpenAI Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint for OpenAI
app.post("/api/openai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100,
    });

    res.status(200).json({ result: response.data.choices[0].text });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Failed to call OpenAI API" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});