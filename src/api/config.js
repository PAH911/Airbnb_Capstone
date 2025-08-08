import axios from "axios";

export const BASE_URL = "https://airbnbnew.cybersoft.edu.vn/api";
export const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjA1LzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1NzAzMDQwMDAwMCIsIm5iZiI6MTcyOTcyODAwMCwiZXhwIjoxNzU3MjAzMjAwfQ.8L6s48bhKNlI81VIJQ7GZJzwrZ2qGOzRK9OtGlTQ0VU";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    TokenCybersoft: TOKEN_CYBERSOFT,
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.token = accessToken;
  }

  console.log("=== API Request ===", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });

  return config;
});

// Response interceptor để log response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("=== API Response ===", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("=== API Error ===", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
