"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { unwrapList } from "@/lib/api-utils";
import type { MenuItem } from "@/types";

export function useVendorItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFetch("/api/vendor/items");
      const list = unwrapList<MenuItem>(result).sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      );
      setItems(list);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load your menu items.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, setItems, loading, error, reload: load };
}
