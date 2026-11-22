"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { unwrapList } from "@/lib/api-utils";

export type PageInfo = {
  currentPage: number;
  totalPages: number;
  total: number;
};

type Query = Record<string, string | number | undefined>;

export function useAdminList<T>(path: string, query: Query) {
  const key = JSON.stringify(query);

  const [items, setItems] = useState<T[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams();
    Object.entries(JSON.parse(key) as Query).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });

    setLoading(true);
    setError(null);

    apiFetch(`${path}?${params.toString()}`)
      .then((result) => {
        if (cancelled) return;

        const list = unwrapList<T>(result);
        const p =
          (result as { pagination?: Record<string, number> }).pagination ?? {};

        setItems(list);
        setPageInfo({
          currentPage: p.currentPage ?? 1,
          totalPages: Math.max(1, p.totalPages ?? 1),
          total:
            p.totalUsers ??
            p.totalItems ??
            p.totalTransactions ??
            p.totalOrders ??
            list.length,
        });
      })
      .catch((e) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Could not load data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, key, tick]);

  return {
    items,
    setItems,
    pageInfo,
    loading,
    error,
    reload: () => setTick((t) => t + 1),
  };
}
