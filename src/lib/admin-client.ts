"use client";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function adminFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/csv")) {
    return res as unknown as T;
  }

  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    throw new ApiError(
      (data && data.error) || `Request failed (${res.status})`,
      res.status,
      data?.details
    );
  }

  return data as T;
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
