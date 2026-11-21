"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/types";

function toOrders(result: unknown): Order[] {
  const data = (result as { data?: unknown } | null)?.data;

  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { orders?: unknown } | undefined)?.orders)
      ? (data as { orders: Order[] }).orders
      : [];

  return [...(list as Order[])].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const result = await apiFetch("/api/orders/my-orders?limit=100");

      setOrders(toOrders(result));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  return {
    orders,
    setOrders,
    loading,
    error,
    reload: load,
  };
}
