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
  CreateCategoryInput,
  UpdateCategoryInput,
  createCategorySchema,
  updateCategorySchema,
} from "@repo/validations";
import { validateImage } from "../../lib/utils/validateImage";
import { streamToBuffer } from "../../lib/utils/streamToBuffer";

const CATEGORY_IMAGE_WIDTH = 200;
const CATEGORY_IMAGE_HEIGHT = 200;

interface CreateCategoryPayload extends CreateCategoryInput {
  imageBuffer: Buffer;
  imageFileName: string;
}

class AdminCategoryService {
  async createCategory(payload: CreateCategoryPayload) {
    try {
      const {
        name,
        seoName,
        categoryType,
        priority,
        imageBuffer,
        imageFileName,
      } = payload;

      validateOrThrow(createCategorySchema, {
        name,
        seoName,
        categoryType,
        priority,
      });
      validateImage(imageBuffer, imageFileName);

      const existing = await prisma.category.findUnique({
        where: { seoName },
      });
      if (existing) {
        throwInputError(`Category with SEO name "${seoName}" already exists`);
      }

      // Step 1 — create category with placeholder to get id
      const category = await prisma.category.create({
        data: { name, seoName, categoryType, priority, image: "pending" },
      });

      // Step 2 — compress
      const compressed = await ImageService.compress(imageBuffer, {
        width: CATEGORY_IMAGE_WIDTH,
        height: CATEGORY_IMAGE_HEIGHT,
      });

      // Step 3 — generate key using category.id
      const key = generateImageKey("category-images", category.id);
      const updateKey = `images/catalogue/${key}`;
      const imageUrl = await S3Service.uploadImage(compressed, updateKey);

      // Step 4 — update with real image url
      return await prisma.category.update({
        where: { id: category.id },
        data: { image: imageUrl },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateCategory(payload: UpdateCategoryInput, imageFile: any | null) {
    try {
      console.log("this is the payload:", payload);
      const input = validateOrThrow(updateCategorySchema, payload);

      const category = await prisma.category.findUnique({
        where: { id: input.id },
      });
      if (!category) return throwNotFoundError("Category not found");

      const { id, ...updateData } = input;

      // ← only update image if new one is provided
      if (imageFile) {
        const { createReadStream, filename } = await imageFile;
        const imageBuffer = await streamToBuffer(createReadStream());
        const imageFileName = filename;

        validateImage(imageBuffer, imageFileName);

        // delete old image from S3
        if (category.image) {
          await S3Service.deleteImage(category.image);
        }

        const compressed = await ImageService.compress(imageBuffer, {
          width: CATEGORY_IMAGE_WIDTH,
          height: CATEGORY_IMAGE_HEIGHT,
        });

        const key = generateImageKey("category-images", category.id);
        const imageUrl = await S3Service.uploadImage(compressed, key);

        return await prisma.category.update({
          where: { id },
          data: { ...updateData, image: imageUrl },
        });
      }

      // ← no image change — update only text fields
      return await prisma.category.update({
        where: { id },
        data: { ...updateData },
      });
    } catch (error) {
      console.log("This is the error:", error);
      handleServiceError(error);
    }
  }

  async deleteCategory(id: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: { brandCategories: true },
          },
        },
      });

      if (!category) return throwNotFoundError("Category not found");

      // ← block delete if brands are linked
      if (category._count.brandCategories > 0) {
        return throwInputError(
          `Cannot delete this category — ${category._count.brandCategories} brand(s) are linked to it. Remove the brands first.`,
        );
      }

      if (category.image) await S3Service.deleteImage(category.image);
      await prisma.category.delete({ where: { id } });

      return { message: "Category deleted successfully", id: category.id };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminCategoryService();
