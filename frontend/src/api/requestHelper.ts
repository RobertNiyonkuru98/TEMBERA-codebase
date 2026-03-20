import axios, { type AxiosRequestConfig } from "axios";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  resp_code: number;
  data: T;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

type RequestOptions = AxiosRequestConfig & {
  token?: string;
};

export async function requestHelper<T>(options: RequestOptions): Promise<ApiResponse<T>> {
  const { token, headers, ...config } = options;

  try {
    const response = await apiClient.request<ApiResponse<T>>({
      ...config,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

    const payload = response.data;

    if (!payload?.success) {
      throw new Error(payload?.message || "Request failed");
    }

    return payload;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Request failed";
      const serverMessage =
        (error.response?.data as { message?: string } | undefined)?.message;
      throw new Error(serverMessage || error.message || fallback);
    }

    throw error instanceof Error ? error : new Error("Request failed");
  }
}
