import axios from "axios";

export const https = axios.create({
  baseURL: "http://localhost:3000",
});
