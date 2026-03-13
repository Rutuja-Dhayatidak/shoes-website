// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://shoes-website-1.onrender.com/api",
});

export const IMAGE_BASE_URL = axiosInstance.defaults.baseURL.replace("/api", "");

/**
 * Normalizes an image path. 
 * If the path contains localhost (from dev database), it replaces it with the correct BASE_URL.
 * If it's a relative path, it prepends the IMAGE_BASE_URL.
 */
export const getSafeImageUrl = (path) => {
    if (!path) return "";
    
    // If it's already a full URL
    if (path.startsWith("http")) {
        // If it points to localhost (common in migrated dev databases), fix it
        if (path.includes("localhost:")) {
            return path.replace(/http:\/\/localhost:\d+/g, IMAGE_BASE_URL);
        }
        return path;
    }
    
    // Ensure relative path has leading slash if missing (though backend usually provides it)
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${normalizedPath}`;
};

// Token automatically add karega
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

  }
  return config;
});

export default axiosInstance;