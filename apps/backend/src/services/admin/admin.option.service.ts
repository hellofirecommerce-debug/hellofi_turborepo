import prisma from "@repo/db";
import {
  handleServiceError,
  throwNotFoundError,
  throwInputError,
} from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import { validateImage } from "../../lib/utils/validateImage";
import { generateImageKey } from "../../lib/utils/imageKey";
import { syncBrandVisibility } from "../../lib/utils/brandVisibility";
import S3Service from "../common/s3.service";
import ImageService from "../common/image.service";
import {
  createOptionSchema,
  updateOptionSchema,
  optionFilterSchema,
  OptionFilterInput,
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
  brandVisibility: true,
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

      if (existing.image) {
        await S3Service.deleteImage(existing.image);
      }

      const key = generateImageKey("option-images", optionId);
      const fullKey = `images/selling/${key}`;

      const imageUrl = await S3Service.uploadRawFile(
        imageData.buffer,
        fullKey,
        imageData.mimetype,
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
          orderBy: [
            { [sortBy]: sortOrder },
            { createdAt: "asc" },
            { id: "asc" },
          ],
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
    resize: boolean = true,
  ) {
    try {
      const validated = validateOrThrow(createOptionSchema, input);
      const { brandVisibility, ...optionData } = validated;

      const condition = await prisma.sellingCondition.findUnique({
        where: { id: validated.conditionId },
      });
      if (!condition) return throwInputError("Condition not found");

      const strategy = optionData.brandVisibilityStrategy ?? "ALL";

      const option = await prisma.$transaction(async (tx) => {
        const created = await tx.sellingOption.create({ data: optionData });

        await syncBrandVisibility(
          tx,
          { optionId: created.id },
          strategy,
          brandVisibility ?? [],
          true,
        );

        return created;
      });

      if (imageData) {
        validateImage(imageData.buffer, imageData.fileName);

        const key = generateImageKey("option-images", option.id);
        const fullKey = `images/selling/${key}`;

        let imageUrl = "";

        if (resize) {
          const compressed = await ImageService.compress(imageData.buffer, {
            width: 304,
            height: 304,
          });
          imageUrl = await S3Service.uploadImage(compressed, fullKey);
        } else {
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
    removeImage: boolean = false,
  ) {
    try {
      const validated = validateOrThrow(updateOptionSchema, input);
      const { id, brandVisibility, ...data } = validated;

      const existing = await prisma.sellingOption.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Option not found");

      let imageUrl = existing.image;

      if (removeImage && existing.image) {
        await S3Service.deleteImage(existing.image);
        imageUrl = null;
      }

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

      const strategy =
        data.brandVisibilityStrategy ?? existing.brandVisibilityStrategy;

      await prisma.$transaction(async (tx) => {
        await tx.sellingOption.update({
          where: { id },
          data: { ...data, image: imageUrl },
        });

        await syncBrandVisibility(
          tx,
          { optionId: id },
          strategy,
          brandVisibility,
          data.brandVisibilityStrategy !== undefined,
        );
      });

      return await prisma.sellingOption.findUnique({
        where: { id },
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
