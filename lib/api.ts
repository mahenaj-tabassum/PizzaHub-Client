"use client";

import { authClient } from "./auth-client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function getApiUrl() {
  if (!API_URL) {
    throw new Error("API URL is not configured. Please contact support.");
  }
  return API_URL;
}

async function parseResponse(response: Response) {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Something went wrong");
  }
  return result;
}

/** Public endpoints (no token), e.g. /api/menu */
export const publicFetch = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${getApiUrl()}${path}`, options);
  return parseResponse(response);
};

/** Protected endpoints. Sends the Better Auth JWT */
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${data.token}`);

  // For FormData (image upload) the browser sets Content-Type itself
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
  });
  return parseResponse(response);
};
