"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { unwrapList } from "@/lib/api-utils";
import type { VendorOrder } from "@/types";

const PER_PAGE = 50;
const MAX_PAGES = 20;

export function useVendorOrders() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const all = new Map<string, VendorOrder>();

      // সার্ভার paginate করে, তাই hasNextPage দেখে সব পেজ আনা হয়
      for (let page = 1; page <= MAX_PAGES; page++) {
        const result = await apiFetch(
          `/api/vendor/orders?page=${page}&limit=${PER_PAGE}`,
        );

        unwrapList<VendorOrder>(result).forEach((o) => all.set(o._id, o));

        const hasNext = (result as { pagination?: { hasNextPage?: boolean } })
          .pagination?.hasNextPage;

        if (!hasNext) break;
      }

      setOrders(
        [...all.values()].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
        ),
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load customer orders.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { orders, setOrders, loading, error, reload: load };
}
