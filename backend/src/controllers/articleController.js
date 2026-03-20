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
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (!article.content || article.content.length < 300) {
      return res.status(400).json({
        message: "Article content too short to rewrite"
      });
    }

    const searchResults = await searchGoogle(article.title);
    if (!searchResults.length) {
      return res.status(400).json({
        message: "No Google results found"
      });
    }

    let competitorLinks;
    try {
      competitorLinks = extractTopArticles(searchResults);
    } catch (err) {
      return res.status(400).json({
        message: "Not enough valid competitor articles found"
      });
    }

    const competitorContents = [];
    for (const link of competitorLinks) {
      try {
        const content = await scrapeArticleContent(link);
        ${competitorContents
        .map(c => `URL: ${c.url}\n${c.content}`)
        .join("\n\n---\n\n")};
      } catch {
        console.warn("Skipping competitor:", link);
      }
    }

    if (competitorContents.length === 0) {
      return res.status(400).json({
        message: "Failed to scrape competitor articles"
      });
    }

    const rewritten = await rewriteArticle(article, competitorContents);

    article.rewrittenContent = `
${rewritten.rewrittenContent}

---
### References
${competitorLinks.map((u, i) => `${i + 1}. ${u}`).join("\n")}
`.trim();

    article.rewrittenAt = new Date();
    article.competitorLinks = competitorLinks;

    await article.save();

    res.json({
      message: "Article rewritten successfully",
      rewrittenContent: article.rewrittenContent
    });

  } catch (err) {
    console.error("Rewrite error:", err);
    res.status(500).json({
      message: "Rewrite failed",
      error: err.message
    });
  }
}
