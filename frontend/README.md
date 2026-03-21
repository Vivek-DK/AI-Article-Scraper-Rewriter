# AI Article Scraper & Rewriter

## Overview

This project is a full-stack implementation for the BeyondChats assignment.  
It scrapes blog articles, stores them in a database, analyzes competitor articles ranking on Google, rewrites the original content using an LLM, and publishes the updated article with proper references.

The project is divided into **three phases**:

- **Phase 1:** Scraping BeyondChats blogs, storing data, and CRUD APIs  
- **Phase 2:** Google search, competitor scraping, AI-based rewriting  
- **Phase 3:** React frontend for managing and viewing articles  

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Axios
- Cheerio
- Serper.dev (Google Search API)
- OpenRouter / LLM (Gemma compatible)

### Frontend
- React (Vite)
- Axios
- React Router DOM

---

## Complete Project Structure


---

## Environment Variables

Create a `.env` file inside the **backend** directory:

```env
MONGO_URL=your_mongodb_connection_string
SERPER_API_KEY=your_serper_api_key
OPENROUTER_API_KEY=your_llm_api_key
