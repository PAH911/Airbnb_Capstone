import axios from "axios";

const api = axios.create({
  baseURL: "https://airbnbnew.cybersoft.edu.vn/api",
});

api.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjA1LzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1NzAzMDQwMDAwMCIsIm5iZiI6MTcyOTcyODAwMCwiZXhwIjoxNzU3MjAzMjAwfQ.8L6s48bhKNlI81VIJQ7GZJzwrZ2qGOzRK9OtGlTQ0VU",
  };
  const accessToken = JSON.parse(
    localStorage.getItem("userAccount")
  )?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
