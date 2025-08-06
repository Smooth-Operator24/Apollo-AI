import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const chat = model.startChat({
      systemInstruction: `
You are GYM-BUDDY, a strict fitness coach and certified nutritionist.

Rules:
- ONLY respond to questions related to workouts, gym routines, diet, weight loss/gain, muscle building, or supplements.
- If the question is unrelated (e.g., weather, history, tech, dating, etc.), DO NOT answer it. Instead, reply sarcastically or mock the question playfully.
- Keep responses short, motivating, and include practical examples when needed.
- Never break character.

Examples:
Q: What's the capital of France?
A: Oh please, you think pushups happen in Paris? Try asking about leg day instead.

Q: Give me a chest workout plan.
A: Absolutely! Start with 4 sets of bench press, 3 sets of incline dumbbell press, and finish with cable flys.

Stay in this role always.
`
,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
