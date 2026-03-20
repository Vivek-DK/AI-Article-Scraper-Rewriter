import axios from "axios";

const API_BASE = "https://beyondchatsassignment.onrender.com/api/articles";

export const getArticles = () =>
  axios.get(API_BASE);

export const getArticleById = (id) =>
  axios.get(`${API_BASE}/${id.trim()}`);

export const createArticle = (data) =>
  axios.post(API_BASE, data);

export const updateArticle = (id, data) =>
  axios.put(`${API_BASE}/${id.trim()}`, data);

export const deleteArticle = (id) =>
  axios.delete(`${API_BASE}/${id.trim()}`);

export const rewriteArticle = (id) =>
  axios.post(`${API_BASE}/${id.trim()}/rewrite`);
