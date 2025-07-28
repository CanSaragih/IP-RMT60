import axios from "axios";

export const https = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
