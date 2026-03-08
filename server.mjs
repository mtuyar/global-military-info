import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

function getAI() {
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
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            const text = response.text;
            if (!text) throw new Error("No response from AI");

            const scores = JSON.parse(text);
            res.json(scores);
        } catch (error) {
            console.error("Error fetching global scores:", error);
            if (error.message?.includes("API key not valid")) {
                return res.status(401).json({ error: "Invalid API key. Please configure a valid Gemini API key." });
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

            const prompt = `You are a military intelligence analyst for a premium interactive geography experience. For the given country (${countryName}, ISO code: ${countryCode}), provide a comprehensive military analysis with the following details:

1. A short elegant tagline related to its military identity
2. A one-sentence highlight of its most notable military strength or characteristic
3. A broad military category (e.g., 'Küresel Süper Güç', 'Bölgesel Güç', 'Savunma Odaklı', 'Gelişmekte Olan Güç', 'Barış Gücü')
4. A relevant emoji (e.g., 🛡️, ⚔️, 🚁, 🎖️)
5. Estimated annual military/defense budget (e.g., "$886 Milyar" or "$886 Billion")
6. Estimated active military personnel count (e.g., "1.4 Milyon" or "1.4 Million")
7. Estimated reserve military personnel count (e.g., "845,000")
8. Estimated number of tanks/armored vehicles (e.g., "6,612")
9. Estimated total military aircraft (e.g., "13,300")
10. Estimated naval vessels count (e.g., "484")
11. Nuclear warheads count ("0" if none, or actual number like "5,550")
12. Estimated global military power rank (1 = strongest, number)
13. Top 3 key military strengths as short phrases

Be factual and use real-world estimates. Use concise, elegant, UI-friendly text. ${langInstruction}`;

            const aiClient = getAI();
            const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            country: {
                                type: "STRING",
                                description: "The name of the country.",
                            },
                            tagline: {
                                type: "STRING",
                                description: "A short elegant tagline.",
                            },
                            highlight: {
                                type: "STRING",
                                description: "A one-sentence highlight of the most iconic military characteristic.",
                            },
                            category: {
                                type: "STRING",
                                description: "A broad military category.",
                            },
                            emoji: {
                                type: "STRING",
                                description: "A single representative emoji.",
                            },
                            militaryBudget: {
                                type: "STRING",
                                description: "Estimated annual defense budget with currency symbol.",
                            },
                            activeMilitary: {
                                type: "STRING",
                                description: "Estimated active military personnel count.",
                            },
                            reserveMilitary: {
                                type: "STRING",
                                description: "Estimated reserve military personnel count.",
                            },
                            tanks: {
                                type: "STRING",
                                description: "Estimated number of tanks/armored vehicles.",
                            },
                            aircraft: {
                                type: "STRING",
                                description: "Estimated total military aircraft.",
                            },
                            navalVessels: {
                                type: "STRING",
                                description: "Estimated naval vessels count.",
                            },
                            nuclearWarheads: {
                                type: "STRING",
                                description: "Nuclear warheads count, '0' if none.",
                            },
                            globalRank: {
                                type: "INTEGER",
                                description: "Global military power ranking (1=strongest).",
                            },
                            strengths: {
                                type: "ARRAY",
                                items: { type: "STRING" },
                                description: "Top 3 key military strengths as short phrases.",
                            },
                        },
                        required: ["country", "tagline", "highlight", "category", "emoji", "militaryBudget", "activeMilitary", "reserveMilitary", "tanks", "aircraft", "navalVessels", "nuclearWarheads", "globalRank", "strengths"],
                    },
                },
            });

            const jsonStr = response.text?.trim() || "{}";
            const data = JSON.parse(jsonStr);

            res.json(data);
        } catch (error) {
            console.error("Error generating insight:", error);
            if (error.message?.includes("API key not valid")) {
                return res.status(401).json({ error: "Invalid API key. Please configure a valid Gemini API key." });
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
