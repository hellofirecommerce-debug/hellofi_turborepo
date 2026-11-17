import prisma from "@repo/db";
import {
  handleServiceError,
  throwNotFoundError,
  throwInputError,
} from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import { validateImage } from "../../lib/utils/validateImage";
import { generateImageKey } from "../../lib/utils/imageKey";
import S3Service from "../common/s3.service";
import ImageService from "../common/image.service";
import {
  createOptionSchema,
  updateOptionSchema,
  optionFilterSchema,
} from "@repo/validations";

const optionInclude = {
  condition: {
    include: {
      step: {
        include: {
          assessment: {
            include: { category: true },
          },
        },
      },
    },
  },
  popupConditions: {
    include: {
      options: true,
    },
  },
  brandScores: true,
  seriesScores: true,
  productScores: true,
};

class AdminOptionService {
  async uploadRawOptionImage(
    optionId: string,
    imageData: { buffer: Buffer; fileName: string; mimetype: string },
  ) {
    try {
      const existing = await prisma.sellingOption.findUnique({
        where: { id: optionId },
      });
      if (!existing) return throwNotFoundError("Option not found");

      validateImage(imageData.buffer, imageData.fileName);

      // Delete old image from S3 if it exists
      if (existing.image) {
        await S3Service.deleteImage(existing.image);
      }

      // Generate the key and upload the raw file directly
      const key = generateImageKey("option-images", optionId);
      const fullKey = `images/selling/${key}`;

      const imageUrl = await S3Service.uploadRawFile(
        imageData.buffer,
        fullKey,
        imageData.mimetype, // Use the original mimetype
      );

      return await prisma.sellingOption.update({
        where: { id: optionId },
        data: { image: imageUrl },
        include: optionInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }
  async getOptions(rawFilter?: any) {
    try {
      const filter = validateOrThrow(optionFilterSchema, rawFilter ?? {});
      const skip = (filter.page - 1) * filter.pageSize;
      const sortBy = filter.sortBy ?? "priority";
      const sortOrder = filter.sortOrder ?? "asc";

      const where: any = {};

      if (filter.conditionId) {
        where.conditionId = filter.conditionId;
      } else if (filter.stepId || filter.assessmentId || filter.categoryId) {
        const conditionWhere: any = {};
        if (filter.stepId) conditionWhere.stepId = filter.stepId;
        else if (filter.assessmentId) {
          conditionWhere.step = { assessmentId: filter.assessmentId };
        } else if (filter.categoryId) {
          conditionWhere.step = {
            assessment: { categoryId: filter.categoryId },
          };
        }
        where.condition = conditionWhere;
      }

      if (filter.search) {
        where.OR = [
          { label: { contains: filter.search, mode: "insensitive" } },
          { title: { contains: filter.search, mode: "insensitive" } },
        ];
      }

      const [items, total] = await Promise.all([
        prisma.sellingOption.findMany({
          where,
          include: optionInclude,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: filter.pageSize,
        }),
        prisma.sellingOption.count({ where }),
      ]);

      return {
        items,
        total,
        page: filter.page,
        pageSize: filter.pageSize,
        totalPages: Math.ceil(total / filter.pageSize),
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getOptionById(id: string) {
    try {
      const option = await prisma.sellingOption.findUnique({
        where: { id },
        include: optionInclude,
      });
      if (!option) return throwNotFoundError("Option not found");
      return option;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createOption(
    input: any,
    imageData: { buffer: Buffer; fileName: string; mimetype: string } | null,
    resize: boolean = true, // 👈 Default to true
  ) {
    try {
      const validated = validateOrThrow(createOptionSchema, input);

      const condition = await prisma.sellingCondition.findUnique({
        where: { id: validated.conditionId },
      });
      if (!condition) return throwInputError("Condition not found");

      const option = await prisma.sellingOption.create({
        data: validated,
      });

      if (imageData) {
        validateImage(imageData.buffer, imageData.fileName);

        const key = generateImageKey("option-images", option.id);
        const fullKey = `images/selling/${key}`;

        let imageUrl = "";

        if (resize) {
          // Compress to 128x128
          const compressed = await ImageService.compress(imageData.buffer, {
            width: 304,
            height: 304,
          });
          imageUrl = await S3Service.uploadImage(compressed, fullKey);
        } else {
          // Upload raw file (no resize)
          imageUrl = await S3Service.uploadRawFile(
            imageData.buffer,
            fullKey,
            imageData.mimetype,
          );
        }

        return await prisma.sellingOption.update({
          where: { id: option.id },
          data: { image: imageUrl },
          include: optionInclude,
        });
      }

      return await prisma.sellingOption.findUnique({
        where: { id: option.id },
        include: optionInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateOption(
    input: any,
    imageData: { buffer: Buffer; fileName: string; mimetype: string } | null,
    resize: boolean = true,
    removeImage: boolean = false, // 👈 Add this
  ) {
    try {
      const validated = validateOrThrow(updateOptionSchema, input);
      const { id, ...data } = validated;

      const existing = await prisma.sellingOption.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Option not found");

      let imageUrl = existing.image;

      // 👇 Handle image removal
      if (removeImage && existing.image) {
        await S3Service.deleteImage(existing.image);
        imageUrl = null;
      }

      // 👇 Handle image upload
      if (imageData) {
        validateImage(imageData.buffer, imageData.fileName);
        if (existing.image) {
          await S3Service.deleteImage(existing.image);
        }

        const key = generateImageKey("option-images", id);
        const fullKey = `images/selling/${key}`;

        if (resize) {
          const compressed = await ImageService.compress(imageData.buffer, {
            width: 128,
            height: 128,
          });
          imageUrl = await S3Service.uploadImage(compressed, fullKey);
        } else {
          imageUrl = await S3Service.uploadRawFile(
            imageData.buffer,
            fullKey,
            imageData.mimetype,
          );
        }
      }

      return await prisma.sellingOption.update({
        where: { id },
        data: { ...data, image: imageUrl },
        include: optionInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteOption(id: string) {
    try {
      const existing = await prisma.sellingOption.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Option not found");

      // Delete image from S3 if it exists
      if (existing.image) {
        await S3Service.deleteImage(existing.image);
      }

      await prisma.sellingOption.delete({ where: { id } });
      return { message: "Option deleted", id };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminOptionService();
