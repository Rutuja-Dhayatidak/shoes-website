// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://shoes-website-1.onrender.com", // backend URL
});

// Token automatically add karega
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

  }
  return config;
});

export default axiosInstance;