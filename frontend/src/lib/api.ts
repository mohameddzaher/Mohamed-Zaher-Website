import axios, { type AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Surface a clean error shape
    const payload = err?.response?.data;
    return Promise.reject(payload ?? { message: err?.message ?? "Network error" });
  },
);
