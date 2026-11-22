export function unwrapList<T>(result: unknown): T[] {
  const data = (result as { data?: unknown } | null)?.data;
  if (Array.isArray(data)) return data as T[];

  const nested = data as { items?: unknown } | undefined;
  if (Array.isArray(nested?.items)) return nested.items as T[];

  return [];
}

export function unwrapData<T>(result: unknown): T | null {
  return (result as { data?: T } | null)?.data ?? null;
}

export function unwrapImageUrl(result: unknown): string | null {
  const r = result as {
    url?: string;
    data?: { url?: string; imageUrl?: string };
  } | null;

  return r?.data?.url ?? r?.data?.imageUrl ?? r?.url ?? null;
}
