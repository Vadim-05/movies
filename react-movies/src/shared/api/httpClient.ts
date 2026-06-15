import { api } from "@/shared/api/http";
import { ApiError } from "@/shared/api/error";
import axios from "axios";

async function request<T>(promise: Promise<any>): Promise<T> {
  try {
    const { data } = await promise;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new ApiError(
        err.message,
        err.response?.status,
        err.response?.data
      );
    }

    throw err;
  }
}

export const apiClient = {
  get<T>(url: string, config?: any): Promise<T> {
    return request(api.get(url, config));
  },

  post<T, B = unknown>(url: string, body?: B, config?: any): Promise<T> {
    return request(api.post(url, body, config));
  },

  put<T, B = unknown>(url: string, body?: B, config?: any): Promise<T> {
    return request(api.put(url, body, config));
  },

  patch<T, B = unknown>(url: string, body?: B, config?: any): Promise<T> {
    return request(api.patch(url, body, config));
  },

  delete<T>(url: string, config?: any): Promise<T> {
    return request(api.delete(url, config));
  },
};