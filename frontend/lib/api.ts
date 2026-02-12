const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type FetchOptions = RequestInit & { json?: unknown };

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
    body: json ? JSON.stringify(json) : rest.body,
    credentials: "include",
  });

  const contentType = res.headers.get("Content-Type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof data === "string" ? data : (data?.detail ?? "Request failed");
    throw new Error(message);
  }
  return data as T;
}
