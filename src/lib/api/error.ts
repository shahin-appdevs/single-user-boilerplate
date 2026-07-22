import { AxiosError } from "axios";

export type FieldErrors = Record<string, string[]>;

export type ApiError = {
  status: number;
  message: string; // human-readable, safe to show
  code?: string; // backend error code if provided
  fields?: FieldErrors; // field → array of messages
  traceId?: string; // from response header if present
  isNetwork: boolean; // true for offline/timeout
  isAuth: boolean; // true for 401
};

const GENERIC_PIN_MESSAGE = "Invalid PIN.";

export const isApiError = (e: unknown): e is ApiError =>
  typeof e === "object" &&
  e !== null &&
  typeof (e as ApiError).status === "number" &&
  typeof (e as ApiError).message === "string" &&
  typeof (e as ApiError).isNetwork === "boolean" &&
  typeof (e as ApiError).isAuth === "boolean";

type LaravelErrorBody = {
  message?: string;
  errors?: FieldErrors;
  code?: string;
};

const headerValue = (
  headers: unknown,
  key: string,
): string | undefined => {
  if (!headers || typeof headers !== "object") return undefined;
  const v = (headers as Record<string, unknown>)[key];
  return typeof v === "string" ? v : undefined;
};

// Defense against echoed input: never surface raw backend message for PIN.
const scrubPin = (fields?: FieldErrors): FieldErrors | undefined => {
  if (!fields || !("pin" in fields)) return fields;
  return { ...fields, pin: [GENERIC_PIN_MESSAGE] };
};

export const parseAxiosError = (err: unknown): ApiError => {
  if (err instanceof AxiosError) {
    if (err.response) {
      const status = err.response.status;
      const data = (err.response.data ?? {}) as LaravelErrorBody;
      const traceId =
        headerValue(err.response.headers, "x-trace-id") ??
        headerValue(err.response.headers, "x-request-id");

      return {
        status,
        message: data.message ?? "Request failed.",
        code: data.code,
        fields: scrubPin(data.errors),
        traceId,
        isNetwork: false,
        isAuth: status === 401,
      };
    }

    // No response → network / timeout.
    return {
      status: 0,
      message: "Network error. Please check your connection.",
      isNetwork: true,
      isAuth: false,
    };
  }

  return {
    status: 0,
    message: "Something went wrong.",
    isNetwork: false,
    isAuth: false,
  };
};

export const firstFieldError = (
  err: ApiError,
  field: string,
): string | undefined => err.fields?.[field]?.[0];

export const flattenFieldErrors = (err: ApiError): string[] =>
  err.fields ? Object.values(err.fields).flat() : [];
