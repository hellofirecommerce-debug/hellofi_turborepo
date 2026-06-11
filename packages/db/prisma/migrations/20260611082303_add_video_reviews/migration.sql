-- CreateEnum
CREATE TYPE "VideoReviewType" AS ENUM ('BUY', 'SELL', 'HOME');

-- CreateTable
CREATE TABLE "video_reviews" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "type" "VideoReviewType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_reviews_pkey" PRIMARY KEY ("id")
);
