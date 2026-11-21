import "server-only";

import { cache } from "react";

import type {
  MenuItem,
  SingleMenuItemResponse,
  MenuListResponse,
  FeaturedMenuResponse,
} from "@/types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export type MenuFilters = {
  q?: string;
  category?: string;
  location?: string;
  sort?: string;
  page?: string;
};

export async function getMenuItems(
  filters: MenuFilters,
): Promise<MenuListResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  params.set("limit", "12");

  const res = await fetch(`${API_URL}/api/menu?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load menu items");

  return res.json();
}

/** Location dropdown options. Returns an empty list if the endpoint fails. */
export async function getLocations(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/menu/locations`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

/** Fetches one menu item. Returns null if it doesn't exist. */
export const getMenuItem = cache(
  async (id: string): Promise<MenuItem | null> => {
    const res = await fetch(`${API_URL}/api/menu/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    if (res.status === 404 || res.status === 400) return null;

    if (!res.ok) throw new Error("Failed to load menu item");

    const json: SingleMenuItemResponse = await res.json();

    return json.data ?? null;
  },
);

export async function getFeaturedItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/menu/featured`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const json: FeaturedMenuResponse = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}
