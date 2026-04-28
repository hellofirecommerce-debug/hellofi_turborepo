import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";
import {
  createSeriesSchema,
  updateSeriesSchema,
  CreateSeriesInput,
  UpdateSeriesInput,
} from "@repo/validations";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";

const seriesInclude = {
  brand: true,
  category: true,
};

class AdminSeriesService {
  async getSeries(filter?: {
    search?: string;
    brandId?: string;
    categoryId?: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const page = filter?.page ?? 1;
      const pageSize = filter?.pageSize ?? 10;
      const skip = (page - 1) * pageSize;

      const where: any = {
        ...(filter?.search && {
          seriesName: { contains: filter.search, mode: "insensitive" },
        }),
        ...(filter?.brandId && { brandId: filter.brandId }),
        ...(filter?.categoryId && { categoryId: filter.categoryId }),
      };

      const [items, total] = await Promise.all([
        prisma.series.findMany({
          where,
          include: seriesInclude,
          orderBy: { priority: "asc" },
          skip,
          take: pageSize,
        }),
        prisma.series.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getSeriesById(id: string) {
    try {
      const series = await prisma.series.findUnique({
        where: { id },
        include: seriesInclude,
      });
      if (!series) return throwNotFoundError("Series not found");
      return series;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createSeries(input: CreateSeriesInput) {
    try {
      const validated = validateOrThrow(createSeriesSchema, input);
      return await prisma.series.create({
        data: {
          brandId: validated.brandId,
          categoryId: validated.categoryId,
          seriesName: validated.seriesName,
          status: validated.status as any,
          priority: validated.priority,
        },
        include: seriesInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateSeries(input: UpdateSeriesInput) {
    try {
      const validated = validateOrThrow(updateSeriesSchema, input);
      const { id, ...updateData } = validated;

      const existing = await prisma.series.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Series not found");

      return await prisma.series.update({
        where: { id },
        data: {
          ...updateData,
          status: updateData.status as any,
        },
        include: seriesInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteSeries(id: string) {
    try {
      const existing = await prisma.series.findUnique({ where: { id } });
      if (!existing) return throwNotFoundError("Series not found");

      await prisma.series.delete({ where: { id } });
      return { id, message: "Series deleted successfully" };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminSeriesService();
