const express = require('express');
const fetch = require('node-fetch'); // v2 syntax for Node.js v16
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const HF_API_KEY = "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";
const HF_MODEL = "google/flan-t5-base";

app.post('/api/ai', async (req, res) => {
  const { question } = req.body;
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: question })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error: ' + err.message });
  }
});

app.listen(5001, () => console.log('Proxy running on http://localhost:5001')); 