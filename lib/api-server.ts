import "server-only";
import type { MenuListResponse } from "@/types";

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

/** Location dropdown এর অপশন। endpoint না থাকলে খালি লিস্ট ফেরত দেয় */
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
