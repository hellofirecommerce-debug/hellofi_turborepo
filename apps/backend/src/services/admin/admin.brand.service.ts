import prisma, { Status } from "@repo/db";
import {
  handleServiceError,
  throwInputError,
  throwNotFoundError,
} from "../../lib/utils/error";
import S3Service from "../common/s3.service";
import ImageService from "../common/image.service";
import { validateImage } from "../../lib/utils/validateImage";
import { generateImageKey } from "../../lib/utils/imageKey";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import {
  CreateBrandInput,
  UpdateBrandInput,
  AddBrandCategoryInput,
  UpdateBrandCategoryInput,
  createBrandSchema,
  updateBrandSchema,
} from "@repo/validations";

const BRAND_IMAGE_WIDTH = 200;
const BRAND_IMAGE_HEIGHT = 200;

interface BrandCategoryItem {
  categoryId: string;
  priority: number;
  status: "ACTIVE" | "INACTIVE";
}

interface CreateBrandPayload extends CreateBrandInput {
  imageBuffer: Buffer;
  imageFileName: string;
}

class AdminBrandService {
  private async createBrandCategories(
    brandId: string,
    brandCategories: BrandCategoryItem[],
  ) {
    await prisma.brandCategory.createMany({
      data: brandCategories.map((bc) => ({
        brandId,
        categoryId: bc.categoryId,
        priority: bc.priority,
        status: bc.status,
      })),
    });
  }
  async createBrand(payload: CreateBrandPayload) {
    try {
      console.log("This is the payload of crateBrand:", payload);
      validateOrThrow(createBrandSchema, {
        name: payload.name,
        seoName: payload.seoName,
        brandCategories: payload.brandCategories,
      });
      validateImage(payload.imageBuffer, payload.imageFileName);

      // ← check duplicate seoName before creating
      const existing = await prisma.brand.findUnique({
        where: { seoName: payload.seoName },
      });
      if (existing) {
        throwInputError(
          `Brand with SEO name "${payload.seoName}" already exists`,
        );
      }

      // Step 1 — save brand with placeholder to get id
      const brand = await prisma.brand.create({
        data: {
          name: payload.name,
          seoName: payload.seoName,
          image: "pending",
        },
      });

      // Step 2 — compress
      const compressed = await ImageService.compress(payload.imageBuffer, {
        width: BRAND_IMAGE_WIDTH,
        height: BRAND_IMAGE_HEIGHT,
      });

      // Step 3 — generate key using brand.id and upload
      const key = generateImageKey("brand-images", brand.id);
      const imageUrl = await S3Service.uploadImage(compressed, key);

      // Step 4 — update brand with real image url
      await prisma.brand.update({
        where: { id: brand.id },
        data: { image: imageUrl },
      });

      // Step 5 — create BrandCategory rows
      await this.createBrandCategories(brand.id, payload.brandCategories);

      // Step 6 — return brand with categories
      return await prisma.brand.findUnique({
        where: { id: brand.id },
        include: {
          brandCategories: {
            include: { category: true },
          },
        },
      });
    } catch (error) {
      console.log("Error while adding the brand:", error);
      handleServiceError(error);
    }
  }

  async updateBrand(
    input: UpdateBrandInput,
    imageData: { buffer: Buffer; fileName: string } | null,
  ) {
    try {
      const validated = validateOrThrow(updateBrandSchema, input);
      const { id, brandCategories, ...updateData } = validated;

      const brand = await prisma.brand.findUnique({ where: { id } });
      if (!brand) return throwNotFoundError("Brand not found");

      // ← update image only if new one provided
      let imageUrl = brand.image;
      if (imageData) {
        const { buffer: imageBuffer, fileName: imageFileName } = imageData;

        validateImage(imageBuffer, imageFileName);

        if (brand.image) await S3Service.deleteImage(brand.image);

        const compressed = await ImageService.compress(imageBuffer, {
          width: BRAND_IMAGE_WIDTH,
          height: BRAND_IMAGE_HEIGHT,
        });

        const key = generateImageKey("brand-images", brand.id);
        imageUrl = await S3Service.uploadImage(compressed, key);
      }

      // ← update brand fields
      await prisma.brand.update({
        where: { id },
        data: { ...updateData, image: imageUrl },
      });

      // ← sync categories — delete old, insert new
      await prisma.brandCategory.deleteMany({ where: { brandId: id } });
      await this.createBrandCategories(id, brandCategories);

      // ← return updated brand with categories
      return await prisma.brand.findUnique({
        where: { id },
        include: {
          brandCategories: {
            include: { category: true },
          },
        },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateBrandImage(
    id: string,
    imageBuffer: Buffer,
    imageFileName: string,
  ) {
    try {
      validateImage(imageBuffer, imageFileName);

      const brand = await prisma.brand.findUnique({ where: { id } });
      if (!brand) return throwNotFoundError("Brand not found");

      if (brand.image) await S3Service.deleteImage(brand.image);

      const compressed = await ImageService.compress(imageBuffer, {
        width: BRAND_IMAGE_WIDTH,
        height: BRAND_IMAGE_HEIGHT,
      });

      const key = generateImageKey("brand-images", brand.id);
      const imageUrl = await S3Service.uploadImage(compressed, key);

      return await prisma.brand.update({
        where: { id },
        data: { image: imageUrl },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteBrand(id: string) {
    try {
      const brand = await prisma.brand.findUnique({ where: { id } });
      if (!brand) return throwNotFoundError("Brand not found");

      if (brand.image) await S3Service.deleteImage(brand.image);

      await prisma.brand.delete({ where: { id } });
      return { message: "Brand deleted successfully", id: brand.id };
    } catch (error) {
      handleServiceError(error);
    }
  }

  // ─── BRAND CATEGORY ───────────────────────────────────────────────

  async addBrandToCategory(input: AddBrandCategoryInput) {
    try {
      const existing = await prisma.brandCategory.findUnique({
        where: {
          brandId_categoryId: {
            brandId: input.brandId,
            categoryId: input.categoryId,
          },
        },
      });

      if (existing) throwNotFoundError("Brand already exists in this category");

      return await prisma.brandCategory.create({
        data: {
          brandId: input.brandId,
          categoryId: input.categoryId,
          priority: input.priority,
          status: input.status,
        },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateBrandCategory(id: string, input: UpdateBrandCategoryInput) {
    try {
      const brandCategory = await prisma.brandCategory.findUnique({
        where: { id },
      });
      if (!brandCategory) throwNotFoundError("BrandCategory not found");

      return await prisma.brandCategory.update({
        where: { id },
        data: { ...input },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async removeBrandFromCategory(brandId: string, categoryId: string) {
    try {
      const existing = await prisma.brandCategory.findUnique({
        where: { brandId_categoryId: { brandId, categoryId } },
      });

      if (!existing) throwNotFoundError("BrandCategory not found");

      await prisma.brandCategory.delete({
        where: { brandId_categoryId: { brandId, categoryId } },
      });

      return { message: "Brand removed from category successfully" };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminBrandService();
