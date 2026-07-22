import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_BASE } from "@/constants/api-endpoints";
import { clearToken, getToken } from "@/lib/auth/token";
import { parseAxiosError } from "./error";
import { claimUnauthorizedHandling, emitAuthEvent } from "./auth-events";


// Custom per-request option. Declaration merge so TS knows `skipAuth`.
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}


export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Avoid sending a stale caller-set bearer when unauthenticated.
    delete config.headers.Authorization;
  }

  if (typeof document !== "undefined") {
    config.headers["Accept-Language"] =
      document.documentElement.lang || "en";
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = parseAxiosError(error);

    if (apiError.status === 401) {
      clearToken();
      if (claimUnauthorizedHandling()) {
        emitAuthEvent("unauthorized");
      }
    }

    return Promise.reject(apiError);
  },
);

export const apiRequest = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const response = await apiClient.request<T>(config);
  return response.data;
};

/**
 * Multipart upload. Clears the default JSON Content-Type so axios sets
 * `multipart/form-data` WITH its boundary — set it manually and the boundary
 * is lost and the backend can't parse the parts.
 */
export const apiUpload = async <T>(
  url: string,
  form: FormData,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  const response = await apiClient.request<T>({
    method: "POST",
    url,
    data: form,
    ...config,
    headers: { ...config.headers, "Content-Type": undefined },
  });
  return response.data;
};
