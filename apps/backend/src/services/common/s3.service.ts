import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { throwServerError } from "../../lib/utils/error";

console.log("AWS ENV CHECK:", {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY?.slice(0, 5),
  bucket: process.env.AWS_S3_BUCKET,
  cdnUrl: process.env.CDN_URL,
});

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const CDN_URL = process.env.CDN_URL!;

class S3Service {
  async uploadImage(buffer: Buffer, key: string): Promise<string> {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000",
        }),
      );
      return key;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return throwServerError("Image upload failed");
    }
  }

  // ── Upload any file with custom content type ──
  async uploadBuffer(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
      return `${CDN_URL}/${key}`;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return throwServerError("File upload failed");
    }
  }

  // ── Delete by key — works for any file type ──
  async deleteFile(key: string): Promise<void> {
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    } catch (error) {
      throwServerError("File delete failed");
    }
  }

  // ── Keep old method as alias so existing code doesn't break ──
  async deleteImage(url: string): Promise<void> {
    return this.deleteFile(url);
  }
}

export default new S3Service();