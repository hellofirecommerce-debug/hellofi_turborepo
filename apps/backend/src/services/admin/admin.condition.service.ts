import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import {
  createConditionSchema,
  updateConditionSchema,
} from "@repo/validations";
import S3Service from "../common/s3.service";
import ImageService from "../common/image.service";
import { validateImage } from "../../lib/utils/validateImage";
import { generateImageKey } from "../../lib/utils/imageKey";

// 👇 CLEANED UP INCLUDES
const conditionInclude = {
  step: {
    include: {
      assessment: {
        include: { category: true },
      },
    },
  },
  options: {
    orderBy: { priority: "asc" as const },
    include: {
      popupConditions: true,
    },
  },
  brandVisibility: true,
  parentOption: true, // Include the parent option if it's a popup
};

class AdminConditionService {
  async getConditions(filter?: {
    stepId?: string;
    assessmentId?: string;
    categoryId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const page = Math.max(1, filter?.page ?? 1);
      const pageSize = Math.min(50, Math.max(1, filter?.pageSize ?? 10));
      const skip = (page - 1) * pageSize;

      const where: any = {};

      if (filter?.stepId) {
        where.stepId = filter.stepId;
      } else if (filter?.assessmentId) {
        where.step = { assessmentId: filter.assessmentId };
      } else if (filter?.categoryId) {
        where.step = { assessment: { categoryId: filter.categoryId } };
      }

      if (filter?.search) {
        where.OR = [
          { title: { contains: filter.search, mode: "insensitive" } },
          { subtitle: { contains: filter.search, mode: "insensitive" } },
        ];
      }

      const [items, total] = await Promise.all([
        prisma.sellingCondition.findMany({
          where,
          include: conditionInclude,
          // tie-breakers keep the order stable across pages
          orderBy: [{ priority: "asc" }, { createdAt: "asc" }, { id: "asc" }],
          skip,
          take: pageSize,
        }),
        prisma.sellingCondition.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getConditionById(id: string) {
    try {
      const condition = await prisma.sellingCondition.findUnique({
        where: { id },
        include: {
          ...conditionInclude,
          // 👇 REMOVED subConditions include. Popup is just a nested condition.
          conditionRules: {
            include: {
              triggers: true,
              ruleBrands: true,
            },
          },
        },
      });
      if (!condition) return throwNotFoundError("Condition not found");
      return condition;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createCondition(
    input: any,
    imageData: { buffer: Buffer; fileName: string } | null,
  ) {
    try {
      const validated = validateOrThrow(createConditionSchema, input);
      const { brandVisibility, ...data } = validated;

      const condition = await prisma.sellingCondition.create({
        data: {
          ...data,
          // 👇 Save parentOptionId if provided
          parentOptionId: data.parentOptionId || null,
          applicableFromDate: data.applicableFromDate
            ? new Date(data.applicableFromDate)
            : null,
          brandVisibility: brandVisibility
            ? { create: brandVisibility }
            : undefined,
        },
      });

      if (imageData) {
        validateImage(imageData.buffer, imageData.fileName);

        const compressed = await ImageService.compress(imageData.buffer, {
          width: 512,
          height: 512,
        });

        const key = generateImageKey("condition-images", condition.id);
        const fullKey = `images/selling/${key}`;

        const imageUrl = await S3Service.uploadImage(compressed, fullKey);

        return await prisma.sellingCondition.update({
          where: { id: condition.id },
          data: { image: imageUrl },
          include: conditionInclude,
        });
      }

      return await prisma.sellingCondition.findUnique({
        where: { id: condition.id },
        include: conditionInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateCondition(
    input: any,
    imageData: { buffer: Buffer; fileName: string } | null,
  ) {
    try {
      const validated = validateOrThrow(updateConditionSchema, input);
      const { id, brandVisibility, ...data } = validated;

      const existing = await prisma.sellingCondition.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Condition not found");

      let imageUrl = existing.image;

      if (imageData) {
        validateImage(imageData.buffer, imageData.fileName);

        if (existing.image) {
          await S3Service.deleteImage(existing.image);
        }

        const compressed = await ImageService.compress(imageData.buffer, {
          width: 512,
          height: 512,
        });

        const key = generateImageKey("condition-images", id);
        const fullKey = `images/selling/${key}`;

        imageUrl = await S3Service.uploadImage(compressed, fullKey);
      }

      if (brandVisibility) {
        await prisma.brandVisibility.deleteMany({
          where: { conditionId: id },
        });
      }

      return await prisma.sellingCondition.update({
        where: { id },
        data: {
          ...data,
          // 👇 Save parentOptionId if provided
          parentOptionId: data.parentOptionId || null,
          image: imageUrl,
          applicableFromDate: data.applicableFromDate
            ? new Date(data.applicableFromDate)
            : undefined,
          brandVisibility: brandVisibility
            ? { create: brandVisibility }
            : undefined,
        },
        include: conditionInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteCondition(id: string) {
    try {
      const existing = await prisma.sellingCondition.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Condition not found");

      if (existing.image) {
        await S3Service.deleteImage(existing.image);
      }

      await prisma.sellingCondition.delete({ where: { id } });
      return { message: "Condition deleted", id };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminConditionService();
