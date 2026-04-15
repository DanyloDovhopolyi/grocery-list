import axios from "axios";

import { getApiBaseUrl } from "@/services/constants";

export const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});
