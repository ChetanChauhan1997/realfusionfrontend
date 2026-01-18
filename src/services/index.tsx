import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { RouteConfig } from "../utils/RouteConfig";
import Router from "next/router";

// Session-based JWT storage
let accessToken: string | null = null;
let expireAt: number | null = null;

// Fetch tokens from sessionStorage
const fetchTokens = () => {
  accessToken = sessionStorage.getItem("jwtAccessToken");
  expireAt = parseInt(sessionStorage.getItem("expireAt") || "0", 10);

  // Check if expired
  const currentUnix = Math.floor(Date.now() / 1000);
  if (expireAt && expireAt <= currentUnix) {
    accessToken = null;
    sessionStorage.removeItem("jwtAccessToken");
    sessionStorage.removeItem("expireAt");
  }
};

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    fetchTokens();

    const language = process.env.NEXT_PUBLIC_LANGUAGE || "en";
    const isEncryption = process.env.NEXT_PUBLIC_IS_ENCRYPTION === "true";

    if (config.headers instanceof AxiosHeaders) {
      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }
      config.headers.set("language", language);
      config.headers.set("isEncryption", isEncryption.toString());
      config.headers.set("portal", "CDA");
    }

    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
       console.log(error.response.status,);
    if (!error.response || error.response.status >= 500) {
      Router.push(RouteConfig.SERVER_ERROR);
    } else if (error.response.status === 401) {
      sessionStorage.removeItem("jwtAccessToken");
      sessionStorage.removeItem("expireAt");
      Router.push(RouteConfig.SESSION_TIME_OUT);
    } else if (error.response.status === 403) {
      sessionStorage.clear();
      Router.push(RouteConfig.PERMISSION_DENIED);
    }
    return Promise.reject(error);
  }
);

export default api;
