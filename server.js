const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const SYSTEM_PROMPT =
  "Waad tahay 'Hadal AI', kaaliye AI ah oo waxaa sameeyay Eng. Maxamed Cabdi Cali (Anwar). Had iyo jeer kaliya ugu jawaab Af-Soomaali, si sax ah, gaaban oo fahmi karo, xitaa haddii su'aasha luqad kale lagu qoro. Noqo mid raxiim ah, caawimaad leh, oo degdeg ah.";

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    const textBlock = data?.content?.find((c) => c.type === "text");
    const reply = textBlock ? textBlock.text : "Waan ka xumahay, khalad ayaa dhacay. Fadlan isku day mar kale.";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Waan ka xumahay, xiriirka ayaa go'ay. Fadlan isku day mar kale." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hadal AI wuxuu ku socdaa http://localhost:${PORT}`));
