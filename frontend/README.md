# 🚀 AI Article Scraper & Rewriter

> Full-stack system that scrapes, analyzes, and rewrites articles using LLMs

---

## 📌 Overview

A production-style full-stack application that:

- Scrapes blog articles from the web  
- Analyzes competitor content using search APIs  
- Rewrites content using LLMs for improved clarity  
- Stores and manages structured data  
- Provides a React dashboard for full control  

---

## ⚡ Key Features

- 🔍 Automated Web Scraping (Cheerio)
- 🧠 AI-Based Content Rewriting (LLMs)
- 📊 Competitor Analysis via Search API
- 🗂 Structured Data Storage (MongoDB)
- 🔐 Clean REST API Architecture
- 💻 Interactive React Dashboard

---

## 🧱 Tech Stack

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Axios  
- Cheerio  
- Serper.dev API  
- OpenRouter (LLM API)  

### Frontend
- React (Vite)  
- Axios  
- React Router DOM  

---


.
├── backend
│   ├── llm
│   ├── node_modules
│   ├── scraper
│   ├── scripts
│   ├── src
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md
---

## 🔄 System Workflow

1. Scrape article content  
2. Store structured data in database  
3. Fetch competitor articles via search API  
4. Process & clean content  
5. Send to LLM for rewriting  
6. Store rewritten version with references  
7. Display via frontend dashboard  

---

## 🧠 Key Engineering Decisions

- Used **MongoDB** for flexible schema and incremental data enrichment  
- Avoided direct Google scraping → used **Serper API** for reliability  
- Implemented **content cleaning pipeline** before LLM processing  
- Designed **modular backend structure** for scalability  

---

## ⚙️ Environment Setup

Create `.env` inside backend:

```env
MONGO_URL=your_mongodb_connection_string
SERPER_API_KEY=your_serper_api_key
OPENROUTER_API_KEY=your_llm_api_key
```
---

## 🚀 Getting Started
### Backend
```
cd backend
npm install
npm run dev
```
### Frontend
```
cd frontend
npm install
npm run dev
```
---

## 📸 Screenshots

--- 
## Landing Page
![image alt](https://github.com/Vivek-DK/AgentsAndTaskManagement/blob/97f9ac137931c32b835640079d9e2de66f37c9ca/project_images/landing_page.png)

---
## Admin Dashboard
![image alt](https://github.com/Vivek-DK/AgentsAndTaskManagement/blob/97f9ac137931c32b835640079d9e2de66f37c9ca/project_images/admin-dashboard.png)

---

## 📈 Improvements (Next Steps)
-Add Redis caching for repeated requests
-Implement job queue (BullMQ / RabbitMQ)
-Improve prompt engineering for consistency
-Add content quality scoring system
-Handle scraping failures with retry logic

---

## ⚠️ Known Limitations
-Some websites block scraping (bot protection)
-LLM output depends on API/model reliability
-No background job queue (currently synchronous)

---

## 🔗 Live Demo
https://ai-article-scraper-rewriter.vercel.app/

---

## 👨‍💻 Author
* **Vivek DK** 
Full Stack Developer
React • Node.js • MongoDB

⭐ If you found this project useful, consider giving it a star.

---


