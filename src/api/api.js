import axios from "axios";

const API_URL = "https://server.portfolio-sport.uz"; // Asosiy API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - har bir so'rovga token qo'shish
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xatoliklarni ushlab qolish
api.interceptors.response.use((response) => {
  return response;
});

export default api;
