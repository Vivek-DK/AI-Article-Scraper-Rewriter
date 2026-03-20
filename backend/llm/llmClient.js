import axios from "axios";

const MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "mistralai/mistral-7b-instruct:free"
];

export async function rewriteWithLLM(prompt) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing");
  }

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🤖 Model: ${model}, Attempt: ${attempt}`);

        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.APP_URL || "http://localhost:8080",
              "X-Title": "beyondchats-ai"
            },
            timeout: 30000
          }
        );

        const content = response?.data?.choices?.[0]?.message?.content;

        if (!content) throw new Error("Empty response");

        return content;

      } catch (err) {
        const status = err.response?.status;

        console.warn(`⚠️ ${model} failed (attempt ${attempt}) → ${status}`);

        if (attempt < 3 && (status === 429 || status >= 500)) {
          await new Promise(r => setTimeout(r, 2000 * attempt));
          continue;
        }

        if (attempt === 3) break;
      }
    }
  }

  throw new Error("All LLM models failed");
}
