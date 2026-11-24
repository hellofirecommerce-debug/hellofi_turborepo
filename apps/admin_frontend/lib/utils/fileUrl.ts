// builds the public URL for an S3 key stored in the DB
export const fileUrl = (key?: string | null): string | null => {
  if (!key) return null;
  const base = (process.env.NEXT_PUBLIC_CDN_URL ?? "").replace(/\/$/, "");
  return `${base}/${key}`;
};

// "documents/inventory-original-bills/<id>/169-bill.pdf" -> "bill.pdf"
export const fileNameFromKey = (key?: string | null): string | null => {
  if (!key) return null;
  const last = key.split("/").pop() ?? key;
  return last.replace(/^\d+-/, "");
};
