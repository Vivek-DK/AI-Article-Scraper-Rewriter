import axios from "axios";

export async function rewriteWithLLM(prompt) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "google/gemma-3-27b-it:free",
      messages: [
        { role: "system", content: "You are a professional content writer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    }
  );
  if (
  !response.data ||
  !response.data.choices ||
  !response.data.choices[0]
) {
  throw new Error("Invalid LLM response");
  console.log("LLM RAW RESPONSE:", JSON.stringify(response.data, null, 2));
}
  return response.data.choices[0].message.content;
}
