
import axios from "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig<D = any, P = any> {
    _retry?: boolean;
  }
}

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const axiosConfig = {
  baseURL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
};

export const api = axios.create(axiosConfig);

const refreshClient = axios.create(axiosConfig);

const AUTH_ENDPOINTS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
]);

let refreshPromise: Promise<void> | null = null;

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;

  const pathname = url
    .replace(/^https?:\/\/[^/]+/i, "")
    .split(/[?#]/, 1)[0]
    .replace(/\/+$/, "");

  return AUTH_ENDPOINTS.has(pathname);
}

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshSession();

      return api.request(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  },
);
