import { API_BASE_URL } from "@/lib/config";

type HttpOptions = RequestInit & {
  // si tu backend usa cookie de sesión, déjalo en true.
  withCredentials?: boolean;
};

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const detail = (data && (data.detail || data.error)) || res.statusText;
    throw new Error(`${res.status} ${detail}`);
  }
  return data as T;
}

export async function httpGet<T>(path: string, opts: HttpOptions = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: opts.withCredentials ? "include" : "same-origin",
    cache: "no-store",
    ...opts,
  });
  return handle<T>(res);
}

export async function httpPost<T>(
  path: string,
  body?: unknown,
  opts: HttpOptions = {}
) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    credentials: opts.withCredentials ? "include" : "same-origin",
    cache: "no-store",
    ...opts,
  });
  return handle<T>(res);
}

export async function httpPatch<T>(
  path: string,
  body?: unknown,
  opts: HttpOptions = {}
) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    credentials: opts.withCredentials ? "include" : "same-origin",
    cache: "no-store",
    ...opts,
  });
  return handle<T>(res);
}
