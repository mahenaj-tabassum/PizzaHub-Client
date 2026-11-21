"use client";

import { authClient } from "./auth-client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing");
}

async function parseResponse(response: Response) {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Something went wrong");
  }
  return result;
}

/** Public endpoints (no token) — e.g. /api/menu */
export const publicFetch = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  return parseResponse(response);
};

/** Protected endpoints — sends Better Auth JWT */
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Unable to get authentication token");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${data.token}`);

  // FormData (image upload) এর ক্ষেত্রে Content-Type browser নিজে সেট করবে
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  return parseResponse(response);
};
