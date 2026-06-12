import prisma from "@repo/db";
import S3Service from "../common/s3.service";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";
import { generateRandomString } from "../../lib/utils/generateRandomString";

class AdminVideoReviewService {
  async getVideoReviews(type?: string) {
    try {
      return await prisma.videoReview.findMany({
        where: { ...(type ? { type: type as any } : {}) },
        orderBy: { priority: "asc" },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getVideoReviewById(id: string) {
    try {
      const review = await prisma.videoReview.findUnique({ where: { id } });
      if (!review) return throwNotFoundError("Video review not found");
      return review;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createVideoReview(
    input: { title?: string; type: string; priority?: number },
    videoBuffer: Buffer,
    videoFileName: string,
    thumbnailBuffer: Buffer,
    thumbnailFileName: string,
  ) {
    try {
      // ── Create record immediately with placeholder URLs ──
      const review = await prisma.videoReview.create({
        data: {
          title: input.title ?? null,
          videoUrl: "",
          thumbnailUrl: "",
          type: input.type as any,
          priority: input.priority ?? 0,
          isActive: true,
        },
      });

      console.log(`✅ Video review created: ${review.id}`);

      // ── Upload video + thumbnail in background ──
      setImmediate(async () => {
        await processAndUploadVideoReview(
          review.id,
          videoBuffer,
          thumbnailBuffer,
        );
      });

      return review;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateVideoReview(
    id: string,
    input: {
      title?: string;
      type?: string;
      priority?: number;
      isActive?: boolean;
    },
    videoBuffer?: Buffer,
    videoFileName?: string,
    thumbnailBuffer?: Buffer,
    thumbnailFileName?: string,
  ) {
    try {
      const existing = await prisma.videoReview.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Video review not found");

      // ── Update non-file fields immediately ──
      const updated = await prisma.videoReview.update({
        where: { id },
        data: {
          title: input.title ?? existing.title,
          type: (input.type as any) ?? existing.type,
          priority: input.priority ?? existing.priority,
          isActive: input.isActive ?? existing.isActive,
        },
      });

      // ── Upload new video/thumbnail in background ──
      if (videoBuffer || thumbnailBuffer) {
        setImmediate(async () => {
          let videoUrl: string | undefined;
          let thumbnailUrl: string | undefined;

          if (videoBuffer) {
            await S3Service.deleteFile(existing.videoUrl);
            const uniqueId = generateRandomString(12);
            const videoKey = `video-reviews/${uniqueId}/video-${generateRandomString(8)}.webm`;
            videoUrl = await S3Service.uploadBuffer(
              videoBuffer,
              videoKey,
              "video/webm",
            );
          }

          if (thumbnailBuffer) {
            await S3Service.deleteFile(existing.thumbnailUrl);
            const uniqueId = generateRandomString(12);
            const thumbnailKey = `video-reviews/${uniqueId}/thumb-${generateRandomString(8)}.webp`;
            thumbnailUrl = await S3Service.uploadImage(
              thumbnailBuffer,
              thumbnailKey,
            );
          }

          await prisma.videoReview.update({
            where: { id },
            data: {
              ...(videoUrl ? { videoUrl } : {}),
              ...(thumbnailUrl ? { thumbnailUrl } : {}),
            },
          });

          console.log(`✅ Video review ${id} files updated`);
        });
      }

      return updated;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteVideoReview(id: string) {
    try {
      const existing = await prisma.videoReview.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Video review not found");

      await Promise.all([
        existing.videoUrl
          ? S3Service.deleteFile(existing.videoUrl)
          : Promise.resolve(),
        existing.thumbnailUrl
          ? S3Service.deleteFile(existing.thumbnailUrl)
          : Promise.resolve(),
      ]);

      await prisma.videoReview.delete({ where: { id } });
      return { id, message: "Video review deleted successfully" };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

// ── Reusable background processor for video + thumbnail upload ──
async function processAndUploadVideoReview(
  reviewId: string,
  videoBuffer: Buffer,
  thumbnailBuffer: Buffer,
) {
  try {
    const uniqueId = generateRandomString(12);
    const videoKey = `video-reviews/${uniqueId}/video-${generateRandomString(8)}.webm`;
    const thumbnailKey = `video-reviews/${uniqueId}/thumb-${generateRandomString(8)}.webp`;

    const [videoUrl, thumbnailUrl] = await Promise.all([
      S3Service.uploadBuffer(videoBuffer, videoKey, "video/webm"),
      S3Service.uploadImage(thumbnailBuffer, thumbnailKey),
    ]);

    await prisma.videoReview.update({
      where: { id: reviewId },
      data: { videoUrl, thumbnailUrl },
    });

    console.log(`✅ Video review ${reviewId} processed`);
  } catch (error) {
    console.error(`❌ Video review processing failed for ${reviewId}:`, error);
  }
}

export default new AdminVideoReviewService();
