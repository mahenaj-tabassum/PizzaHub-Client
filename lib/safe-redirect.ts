export function getSafeCallbackUrl(
  raw: string | null | undefined,
  origin: string,
): string | null {
  if (!raw) return null;

  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  if (raw.includes("\\")) return null;
  if (/[\u0000-\u001f\u007f]/.test(raw)) return null;

  try {
    const url = new URL(raw, origin);

    if (url.origin !== origin) return null;

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
