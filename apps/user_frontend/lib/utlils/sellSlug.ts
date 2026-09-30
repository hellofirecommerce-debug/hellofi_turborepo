// "256GB" / "256 GB" / "256-gb" -> "256gb", "1 TB" / "1tb" -> "1tb"
export const normalizeSize = (value?: string | null) =>
  (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Used when building links: "256GB" -> "256-gb", "1 TB" -> "1-tb"
export const sizeToSlug = (value?: string | null) =>
  normalizeSize(value).replace(/^(\d+)(gb|tb)$/, "$1-$2");

// Accepts "12-gb-256-gb", "12gb-256gb", "256gb", "1tb", "1-tb" ...
export function parseVariantSlug(slug: string) {
  const m = slug.match(/^(.+?)(?:-(\d+)-?(gb))?-(\d+)-?(gb|tb)$/);
  if (!m) return null;
  return {
    baseSlug: m[1]!,
    ramKey: m[2] ? `${m[2]}${m[3]}` : null, // "12gb"
    storageKey: `${m[4]}${m[5]}`, // "256gb" or "1tb"
  };
}
