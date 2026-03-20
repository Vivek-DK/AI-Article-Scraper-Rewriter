import axios from "axios";

const SERPER_URL = "https://google.serper.dev/search";

export async function searchGoogle(query) {
  try {
    const response = await axios.post(
      SERPER_URL,
      {
        q: query,
        num: 10
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    return response.data.organic || [];
  } catch (err) {
    throw new Error(
      `Google search failed: ${err.response?.status || err.message}`
    );
  }
}

export function extractTopArticles(results) {
  const blockedDomains = [
    "beyondchats.com",
    "youtube.com",
    "amazon.",
    "flipkart.",
    "reddit.com",
    "quora.com",
    "stackoverflow.com",
    "github.com"
  ];

  const valid = [];

  for (const item of results) {
    const url = item.link;
    if (!url) continue;

    if (blockedDomains.some(d => url.includes(d))) continue;

    if (
      url.endsWith(".pdf") ||
      url.includes("/feed") ||
      url.includes("/tag/") ||
      url.includes("/category/")
    ) continue;

    valid.push(url);

    if (valid.length === 3) break; // take more, safer
  }

  if (valid.length === 0) {
    throw new Error("No valid competitor articles found");
  }

  return valid;
}
