import axios from "axios";

interface ApiErrorResponse {
  status?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly code: string | undefined;

  constructor(
    message: string,
    status?: number,
    code?: string,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return new ApiError("An unexpected error occurred.");
  }

  const status = error.response?.status;
  const responseData = error.response?.data;

  if (responseData?.error?.message) {
    return new ApiError(
      responseData.error.message,
      status,
      responseData.error.code,
    );
  }

  if (!error.response) {
    return new ApiError(
      "Unable to connect to the server. Please check your connection.",
    );
  }

  return new ApiError(
    "Failed to process the request.",
    status,
  );
}