"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAllPages } from "@/lib/fetch-all";
import type { AdminTransaction } from "@/types";

export function useAdminTransactions() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const all = await fetchAllPages<AdminTransaction>(
        "/api/admin/transactions",
      );
      setTransactions(
        all.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { transactions, loading, error, reload: load };
}
