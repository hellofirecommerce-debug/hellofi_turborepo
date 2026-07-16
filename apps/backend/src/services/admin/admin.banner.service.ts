import prisma from "@repo/db";
import {
  handleServiceError,
  throwInputError,
  throwNotFoundError,
} from "../../lib/utils/error";
import S3Service from "../common/s3.service";
import ImageService from "../common/image.service";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import { generateImageKey } from "../../lib/utils/imageKey";
import {
  CreateBannerInput,
  UpdateBannerInput,
  createBannerSchema,
  updateBannerSchema,
} from "@repo/validations";
import { validateImage } from "../../lib/utils/validateImage";
import { streamToBuffer } from "../../lib/utils/streamToBuffer";

// desktop (lg) and mobile (sm) target sizes
const BANNER_LG_WIDTH = 1600;
const BANNER_LG_HEIGHT = 680;
const BANNER_SM_WIDTH = 800;
const BANNER_SM_HEIGHT = 400;

interface CreateBannerPayload extends CreateBannerInput {
  lgBuffer: Buffer;
  lgFileName: string;
  smBuffer: Buffer;
  smFileName: string;
}

class AdminBannerService {
  async createBanner(payload: CreateBannerPayload) {
    try {
      const {
        alt,
        redirectUrl,
        placement,
        priority,
        isActive,
        startDate,
        endDate,
        lgBuffer,
        lgFileName,
        smBuffer,
        smFileName,
      } = payload;

      validateOrThrow(createBannerSchema, {
        alt,
        redirectUrl,
        placement,
        priority,
        isActive,
        startDate,
        endDate,
      });

      // ← block creating a second banner for a placement that already has one
      const existing = await prisma.banner.findFirst({
        where: { placement: placement as any },
      });
      if (existing) {
        return throwInputError(
          `A banner already exists for placement "${placement}". Delete or update the existing one instead.`,
        );
      }

      // validate both images
      validateImage(lgBuffer, lgFileName);
      validateImage(smBuffer, smFileName);

      // Step 1 — create banner with placeholders to get id
      const banner = await prisma.banner.create({
        data: {
          alt,
          redirectUrl: redirectUrl || null,
          placement: placement as any,
          priority,
          isActive: isActive ?? true,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          lg: "pending",
          sm: "pending",
        },
      });

      // Step 2 — compress both (desktop + mobile separately)
      const compressedLg = await ImageService.compress(lgBuffer, {
        width: BANNER_LG_WIDTH,
        height: BANNER_LG_HEIGHT,
      });
      const compressedSm = await ImageService.compress(smBuffer, {
        width: BANNER_SM_WIDTH,
        height: BANNER_SM_HEIGHT,
      });

      // Step 3 — generate keys using banner.id + suffix
      const lgKey = `images/banners/${generateImageKey("banner-lg", banner.id)}`;
      const smKey = `images/banners/${generateImageKey("banner-sm", banner.id)}`;

      const lgUrl = await S3Service.uploadImage(compressedLg, lgKey);
      const smUrl = await S3Service.uploadImage(compressedSm, smKey);

      // Step 4 — update with real urls
      return await prisma.banner.update({
        where: { id: banner.id },
        data: { lg: lgUrl, sm: smUrl },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateBanner(
    payload: UpdateBannerInput,
    lgFile: any | null,
    smFile: any | null,
  ) {
    try {
      const input = validateOrThrow(updateBannerSchema, payload);

      const banner = await prisma.banner.findUnique({
        where: { id: input.id },
      });
      if (!banner) return throwNotFoundError("Banner not found");

      // ← if placement is being changed, make sure no other banner already owns it
      if (input.placement && input.placement !== banner.placement) {
        const existing = await prisma.banner.findFirst({
          where: { placement: input.placement as any },
        });
        if (existing && existing.id !== banner.id) {
          return throwInputError(
            `A banner already exists for placement "${input.placement}". Delete or update the existing one instead.`,
          );
        }
      }

      const { id, redirectUrl, startDate, endDate, ...rest } = input;

      const updateData: any = {
        ...rest,
        redirectUrl: redirectUrl || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      };

      // ← update desktop image only if a new one is provided
      if (lgFile) {
        const { createReadStream, filename } = await lgFile;
        const lgBuffer = await streamToBuffer(createReadStream());
        validateImage(lgBuffer, filename);

        if (banner.lg && banner.lg !== "pending") {
          await S3Service.deleteImage(banner.lg);
        }

        const compressedLg = await ImageService.compress(lgBuffer, {
          width: BANNER_LG_WIDTH,
          height: BANNER_LG_HEIGHT,
        });
        const lgKey = `images/banners/${generateImageKey("banner-lg", banner.id)}`;
        updateData.lg = await S3Service.uploadImage(compressedLg, lgKey);
      }

      // ← update mobile image only if a new one is provided
      if (smFile) {
        const { createReadStream, filename } = await smFile;
        const smBuffer = await streamToBuffer(createReadStream());
        validateImage(smBuffer, filename);

        if (banner.sm && banner.sm !== "pending") {
          await S3Service.deleteImage(banner.sm);
        }

        const compressedSm = await ImageService.compress(smBuffer, {
          width: BANNER_SM_WIDTH,
          height: BANNER_SM_HEIGHT,
        });
        const smKey = `images/banners/${generateImageKey("banner-sm", banner.id)}`;
        updateData.sm = await S3Service.uploadImage(compressedSm, smKey);
      }

      return await prisma.banner.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteBanner(id: string) {
    try {
      const banner = await prisma.banner.findUnique({ where: { id } });
      if (!banner) return throwNotFoundError("Banner not found");

      // delete both images from S3
      if (banner.lg && banner.lg !== "pending") {
        await S3Service.deleteImage(banner.lg);
      }
      if (banner.sm && banner.sm !== "pending") {
        await S3Service.deleteImage(banner.sm);
      }

      await prisma.banner.delete({ where: { id } });

      return { message: "Banner deleted successfully", id: banner.id };
    } catch (error) {
      handleServiceError(error);
    }
  }

  // frontend — active banners for a placement (e.g. HOME, BUY_MOBILE)
  async getActiveBanner(placement: string) {
    try {
      const now = new Date();
      return await prisma.banner.findFirst({
        where: {
          placement: placement as any,
          isActive: true,
          AND: [
            { OR: [{ startDate: null }, { startDate: { lte: now } }] },
            { OR: [{ endDate: null }, { endDate: { gte: now } }] },
          ],
        },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  // admin — all banners, optionally by placement
  async getAllBanners(placement?: string) {
    try {
      return await prisma.banner.findMany({
        where: placement ? { placement: placement as any } : {},
        orderBy: [{ placement: "asc" }, { priority: "asc" }],
      });
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminBannerService();
