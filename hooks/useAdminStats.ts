"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { unwrapData } from "@/lib/api-utils";
import type { AdminStats } from "@/types";

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const result = await apiFetch("/api/admin/stats");
      const data = unwrapData<AdminStats>(result);
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
