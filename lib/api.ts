/* Responsibility: 
- Better Auth থেকে JWT সংগ্রহ করা।
- Express API URL তৈরি করা।
- Authorization header-এ token পাঠানো।
- Response handle করা।
- এই helper browser-side protected API calls-এর জন্য।
*/

"use client";
import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_APP_URL;
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is missing");
}

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  // 1. Get JWT from Better Auth
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Unable to get authentication token");
  }

  // 2. Prepare Headers
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${data.token}`);

  // 3. Send Request to Express
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  // 4. Parse the response
  const result = await response.json();

  // Handle API errors
  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }
  return result;
};
