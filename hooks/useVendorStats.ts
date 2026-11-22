"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { unwrapData } from "@/lib/api-utils";
import type { VendorStats } from "@/types";

export function useVendorStats() {
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFetch("/api/vendor/stats");
      const data = unwrapData<VendorStats>(result);
      if (!data) throw new Error("No statistics returned.");

      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, loading, error, reload: load };
}
