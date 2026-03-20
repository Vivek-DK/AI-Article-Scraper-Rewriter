import Article from "../models/Article.js";
import mongoose from "mongoose";
import { rewriteArticle } from "../services/rewriteArticleService.js";
import { searchGoogle, extractTopArticles } from "../../scripts/googleSearch.js";
import { scrapeArticleContent } from "../../scripts/scrapeArticleContent.js";

// CREATE
export const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getArticleById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid article ID" });
  }

  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json(article);
};


// UPDATE
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export async function rewriteArticleController(req, res) {
  console.log("Rewrite request received:", req.params.id);

  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      console.log("Article not found");
      return res.status(404).json({ message: "Article not found" });
    }

    console.log("Article found:", article.title);

    if (!article.content || article.content.length < 300) {
      console.log("Content too short:", article.content?.length);
      return res.status(400).json({
        message: "Article content too short to rewrite"
      });
    }

    console.log("Searching Google...");
    const searchResults = await searchGoogle(article.title);
    console.log("Search results count:", searchResults.length);

    if (!searchResults.length) {
      console.log("No Google results");
      return res.status(400).json({
        message: "No Google results found"
      });
    }

    let competitorLinks;
    try {
      competitorLinks = extractTopArticles(searchResults);
      console.log("Competitor links:", competitorLinks);
    } catch (err) {
      console.error("Extract competitors failed:", err.message);
      return res.status(400).json({
        message: "Not enough valid competitor articles found"
      });
    }

    const competitorContents = [];

    for (const link of competitorLinks) {
      console.log("Scraping:", link);

      try {
        const content = await scrapeArticleContent(link);
        console.log("Scraped length:", content.length);

        competitorContents.push({
          url: link,
          content: content.slice(0, 1500) // prevent huge prompts
        });

      } catch (err) {
        console.warn("Skipping competitor:", link);
        console.warn("Reason:", err.message);
      }
    }

    console.log("Competitor contents count:", competitorContents.length);

     if (competitorContents.length === 0) {
      console.warn("No competitors, using original article");

      competitorContents.push({
        url: "fallback",
        content: article.content.slice(0, 1500)
      });
    }

    console.log("Sending to LLM...");
    let rewritten;

    try {
      rewritten = await rewriteArticle(article, competitorContents);
      console.log("LLM response received");
    } catch (err) {
      console.error("LLM FAILED:");
      console.error(err.response?.data || err.message);
      throw err;
    }

    if (!rewritten?.rewrittenContent) {
      console.log("Empty rewritten content");
      throw new Error("LLM returned empty content");
    }

    console.log("Rewritten content length:", rewritten.rewrittenContent.length);

    article.rewrittenContent = `
${rewritten.rewrittenContent}

---
### References
${competitorLinks.map((u, i) => `${i + 1}. ${u}`).join("\n")}
`.trim();

    article.rewrittenAt = new Date();
    article.competitorLinks = competitorLinks;

    await article.save();
    console.log("Article saved successfully");

    res.json({
      message: "Article rewritten successfully",
      rewrittenContent: article.rewrittenContent
    });

  } catch (err) {
    console.error("FINAL ERROR:");
    console.error(err.stack || err.message);

    res.status(500).json({
      message: "Rewrite failed",
      error: err.message
    });
  }
}
