import axios from "axios";

export async function rewriteWithLLM(prompt) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing");
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:8080",
          "X-Title": "beyondchats-ai-rewriter"
        },
        timeout: 30000 // prevent hanging
      }
    );

    // Validate response properly
    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Invalid LLM response:", response.data);
      throw new Error("Empty response from LLM");
    }

    return content;

  } catch (err) {
    console.error("LLM ERROR:");

    // Axios-specific debug
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }

    throw new Error("LLM request failed");
  }
}
