export const ERROR_STATUS_CODES = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMIT_EXCEEDED: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type AppErrorCode = keyof typeof ERROR_STATUS_CODES;

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly statusCode: (typeof ERROR_STATUS_CODES)[AppErrorCode];

  constructor(
    code: AppErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);

    this.name = "AppError";
    this.code = code;
    this.statusCode = ERROR_STATUS_CODES[code];

    Error.captureStackTrace?.(this, AppError);
  }
}
