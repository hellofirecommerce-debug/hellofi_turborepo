import S3Service from "../../services/common/s3.service";
import { throwInputError } from "./error";

export type UploadedFile = {
  buffer: Buffer;
  fileName: string;
  mimetype: string;
};

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const safeName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);

export function validateOriginalBill(file: UploadedFile) {
  if (!ALLOWED_TYPES.has(file.mimetype)) {
    throwInputError("Original bill must be a PDF, JPG, PNG or WEBP file");
  }
  if (file.buffer.length > MAX_BYTES) {
    throwInputError("Original bill must be 10 MB or smaller");
  }
  if (file.buffer.length === 0) {
    throwInputError("Original bill file is empty");
  }
}

// uploads the original file (no compression) and returns the S3 key
export async function uploadOriginalBill(
  inventoryId: string,
  file: UploadedFile,
): Promise<string> {
  validateOriginalBill(file);

  const key = `documents/inventory-original-bills/${inventoryId}/${Date.now()}-${safeName(file.fileName)}`;

  return S3Service.uploadRawFile(file.buffer, key, file.mimetype);
}

// never throws: a failed cleanup must not break the request
export async function deleteOriginalBillQuietly(key?: string | null) {
  if (!key) return;
  try {
    await S3Service.deleteFile(key);
  } catch (error) {
    console.error("Could not delete original bill from S3:", key, error);
  }
}
