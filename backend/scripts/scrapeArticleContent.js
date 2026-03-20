import axios from "axios";
import { load } from "cheerio";

function normalizeUrl(url) {
  // Force ALL through Jina (production safe)
  return `https://r.jina.ai/${url}`;
}

export async function scrapeArticleContent(url) {
  const finalUrl = normalizeUrl(url);

  console.log("Fetching:", finalUrl);

  try {
    const { data } = await axios.get(finalUrl, {
      timeout: 20000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!data || typeof data !== "string") {
      throw new Error("Empty response");
    }

    // Jina already gives clean text
    if (data.length < 300) {
      throw new Error("Content too short");
    }

    return data.slice(0, 3000); // limit size (IMPORTANT)

  } catch (err) {
    console.error("Scrape failed:", err.message);
    throw err;
  }
}
