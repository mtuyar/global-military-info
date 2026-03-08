import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

function getAI(): GoogleGenAI {
  // Always read fresh from process.env to avoid caching old/invalid keys
  // Trim the key to remove any accidental whitespace or newlines
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({ apiKey: key });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/global-defense-scores", async (req, res) => {
    try {
      const prompt = `You are a military intelligence analyst. Provide a JSON object mapping country names to their estimated defense industry and military strength score (0 to 100). Score as many countries as you can, covering all major and minor nations (at least 150 countries). The output must be ONLY a valid JSON object where keys are standard English country names and values are numbers. Example: {"United States of America": 100, "China": 95, "Russia": 90, "Turkey": 85, "France": 80, "Germany": 75, "United Kingdom": 78, "India": 82}`;

      const aiClient = getAI();
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");

      const scores = JSON.parse(text);
      res.json(scores);
    } catch (error: any) {
      console.error("Error fetching global scores:", error);
      if (error.message?.includes("API key not valid")) {
        return res.status(401).json({ error: "Invalid API key. Please configure a valid Gemini API key in the AI Studio settings." });
      }
      res.status(500).json({ error: "Failed to fetch global scores" });
    }
  });

  app.post("/api/country-insight", async (req, res) => {
    try {
      const { countryName, countryCode, language = 'tr' } = req.body;

      if (!countryName) {
        return res.status(400).json({ error: "Country name is required" });
      }

      const langInstruction = language === 'tr' ? 'Respond entirely in Turkish.' : 'Respond entirely in English.';

      const prompt = `You are a military intelligence analyst for a premium interactive geography experience. For the given country (${countryName}, ISO code: ${countryCode}), provide a concise overview of its military capabilities, armed forces, or defense strategy. Return a short elegant tagline related to its military, a one-sentence highlight of its most notable military strength or characteristic, a broad military category (e.g., 'Global Superpower', 'Regional Force', 'Defensive Military'), and a relevant emoji (e.g., 🛡️, ⚔️, 🚁). Do not give long paragraphs. Be concise, stylish, and UI-friendly. ${langInstruction}`;

      const aiClient = getAI();
      const response = await aiClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              country: {
                type: Type.STRING,
                description: "The name of the country.",
              },
              tagline: {
                type: Type.STRING,
                description: "A short elegant tagline (e.g. 'Precision and innovation').",
              },
              highlight: {
                type: Type.STRING,
                description: "A one-sentence highlight of the most iconic characteristic.",
              },
              category: {
                type: Type.STRING,
                description: "A broad category (e.g. 'Technology', 'Nature', 'Culture').",
              },
              emoji: {
                type: Type.STRING,
                description: "A single representative emoji.",
              },
            },
            required: ["country", "tagline", "highlight", "category", "emoji"],
          },
        },
      });

      const jsonStr = response.text?.trim() || "{}";
      const data = JSON.parse(jsonStr);

      res.json(data);
    } catch (error: any) {
      console.error("Error generating insight:", error);
      if (error.message?.includes("API key not valid")) {
        return res.status(401).json({ error: "Invalid API key. Please configure a valid Gemini API key in the AI Studio settings." });
      }
      res.status(500).json({ error: "Failed to generate insight" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
