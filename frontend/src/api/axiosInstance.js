// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://shoes-website-1.onrender.com/api",
});

export const IMAGE_BASE_URL = axiosInstance.defaults.baseURL.replace("/api", "");

// Token automatically add karega
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

  }
  return config;
});

export default axiosInstance;