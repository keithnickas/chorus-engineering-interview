import { ErrorHandler } from "../helpers/error-handler";
import { UI_API_BASE_URL as baseUrl } from "./constants";

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ErrorHandler(res.status, text);
  }

  if (res.status === 204 || res.status === 205) return undefined as unknown as T;

  const text = await res.text();
  if (!text.trim()) return undefined as unknown as T;

  return JSON.parse(text) as T;
}

export async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, init);
  return handleResponse<T>(res);
}
