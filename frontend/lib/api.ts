const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  raw?: unknown;

  constructor(args: {
    status: number;
    code: string;
    message: string;
    details?: unknown;
    raw?: unknown;
  }) {
    super(args.message);
    this.name = "ApiError";
    this.status = args.status;
    this.code = args.code;
    this.details = args.details;
    this.raw = args.raw;
  }
}

type FetchOptions = Omit<RequestInit, "body"> & { json?: unknown };

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { json, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: json !== "undefined" ? JSON.stringify(json) : "undefined",
    credentials: "include",
  });

  const contentType = res.headers.get("Content-Type") || "";
  const rawBody = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (res.ok) return rawBody as T;

  const maybeApiError = rawBody as Partial<ApiErrorPayload>;
  if (maybeApiError?.error?.code && maybeApiError?.error?.message) {
    throw new ApiError({
      status: res.status,
      code: maybeApiError.error.code,
      message: maybeApiError.error.message,
      details: maybeApiError.error.details,
      raw: rawBody,
    });
  }

  const fallbackMessage =
    typeof rawBody === "string" && rawBody.trim().length > 0
      ? rawBody
      : `Request failed (${res.status})`;

  throw new ApiError({
    status: res.status,
    code: "UNKNOWN_ERROR",
    message: fallbackMessage,
    raw: rawBody,
  });
}
