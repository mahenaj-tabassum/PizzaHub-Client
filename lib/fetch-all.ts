"use client";

import { apiFetch } from "@/lib/api";
import { unwrapList } from "@/lib/api-utils";

type Pagination = {
  hasNextPage?: boolean;
  currentPage?: number;
  totalPages?: number;
};

/** পেজ করা API এর সব পেজ একসাথে আনে */
export async function fetchAllPages<T extends { _id: string }>(
  path: string,
  perPage = 50,
  maxPages = 20,
) {
  const all = new Map<string, T>();
  const sep = path.includes("?") ? "&" : "?";

  for (let page = 1; page <= maxPages; page++) {
    const result = await apiFetch(`${path}${sep}page=${page}&limit=${perPage}`);
    unwrapList<T>(result).forEach((item) => all.set(item._id, item));

    const p = (result as { pagination?: Pagination }).pagination;
    const hasNext =
      p?.hasNextPage ??
      (p?.totalPages !== undefined && (p.currentPage ?? page) < p.totalPages);

    if (!hasNext) break;
  }

  return [...all.values()];
}
