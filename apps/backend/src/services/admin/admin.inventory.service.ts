import prisma from "@repo/db";
import {
  handleServiceError,
  throwInputError,
  throwNotFoundError,
} from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import {
  createInventoryProductSchema,
  updateInventoryProductSchema,
  markAsSoldSchema,
  CreateInventoryProductInput,
  UpdateInventoryProductInput,
  MarkAsSoldInput,
} from "@repo/validations";

class AdminInventoryService {
  private generateOrderId(imeiOrSerial: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    const imeiSuffix = imeiOrSerial.slice(-5);
    return `HF-${timestamp}-${random}-${imeiSuffix}`;
    // e.g. HF-174996-X4-AB123 = 19 chars
  }

  private calculateTat(purchaseDate: Date, sellingDate: Date): number {
    const diff = sellingDate.getTime() - purchaseDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  async getInventoryProducts(filter?: {
    search?: string;
    status?: string;
    brandId?: string;
    categoryId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    dateType?: "purchase" | "selling" | "all";
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const page = filter?.page ?? 1;
      const pageSize = filter?.pageSize ?? 10;
      const skip = (page - 1) * pageSize;
      const sortBy = filter?.sortBy ?? "createdAt";
      const sortOrder = filter?.sortOrder === "asc" ? "asc" : "desc";

      const buildDateCondition = () => {
        if (!filter?.dateFrom && !filter?.dateTo) return {};

        const dateRange = {
          ...(filter.dateFrom && { gte: new Date(filter.dateFrom) }),
          ...(filter.dateTo && { lte: new Date(filter.dateTo) }),
        };

        const dateType = filter.dateType ?? "purchase";

        if (dateType === "selling") return { sellingDate: dateRange };
        if (dateType === "all") {
          return {
            OR: [{ purchaseDate: dateRange }, { sellingDate: dateRange }],
          };
        }
        return { purchaseDate: dateRange };
      };

      const searchCondition = filter?.search
        ? {
            OR: [
              {
                imeiOrSerial: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
              {
                orderId: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
              {
                productName: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
              {
                customerName: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
              {
                customerPhone: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
              {
                customerEmail: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
              {
                sellingCustomerName: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
              {
                sellingCustomerPhone: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
              {
                sellingCustomerEmail: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {};

      const where = {
        isActive: true,
        ...searchCondition,
        ...(filter?.status && { status: filter.status as any }),
        ...(filter?.brandId && { brandId: filter.brandId }),
        ...(filter?.categoryId && { categoryId: filter.categoryId }),
        ...buildDateCondition(),
      };

      const [items, total] = await Promise.all([
        prisma.inventoryProduct.findMany({
          where,
          include: { brand: true, category: true },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.inventoryProduct.count({ where }),
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

  async getInventoryProductById(id: string) {
    try {
      const product = await prisma.inventoryProduct.findUnique({
        where: { id },
        include: { brand: true, category: true },
      });
      if (!product) return throwNotFoundError("Inventory product not found");
      return product;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getInventoryProductByOrderId(orderId: string) {
    try {
      return await prisma.inventoryProduct.findFirst({
        where: { orderId },
        include: { brand: true, category: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getInventoryProductByImei(imeiOrSerial: string) {
    try {
      return await prisma.inventoryProduct.findMany({
        where: { imeiOrSerial, isActive: true },
        include: { brand: true, category: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createInventoryProduct(input: CreateInventoryProductInput) {
    try {
      const validated = validateOrThrow(createInventoryProductSchema, input);

      // Check duplicate IMEI
      const existing = await prisma.inventoryProduct.findFirst({
        where: { imeiOrSerial: validated.imeiOrSerial, isActive: true },
      });
      if (existing) {
        throwInputError(
          `Product with IMEI/Serial "${validated.imeiOrSerial}" already exists`,
        );
      }

      const orderId = this.generateOrderId(validated.imeiOrSerial);

      return await prisma.inventoryProduct.create({
        data: {
          ...validated,
          orderId,
          purchaseDate: new Date(validated.purchaseDate),
          costPrice: validated.costPrice,
          otherCharges: validated.otherCharges ?? 0,
          warrantyPurchaseDate: validated.warrantyPurchaseDate
            ? new Date(validated.warrantyPurchaseDate)
            : null,
        },
        include: { brand: true, category: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateInventoryProduct(input: UpdateInventoryProductInput) {
    try {
      const validated = validateOrThrow(updateInventoryProductSchema, input);
      const { id, ...updateData } = validated;

      const product = await prisma.inventoryProduct.findUnique({
        where: { id },
      });
      if (!product) return throwNotFoundError("Inventory product not found");

      // ← only recalculate if costPrice or otherCharges actually changed
      const costPriceChanged =
        updateData.costPrice !== undefined &&
        Number(updateData.costPrice) !== Number(product.costPrice);

      const otherChargesChanged =
        updateData.otherCharges !== undefined &&
        Number(updateData.otherCharges) !== Number(product.otherCharges);

      let extraUpdate = {};

      if (
        product.status === "SOLD" &&
        product.sellingPrice &&
        (costPriceChanged || otherChargesChanged)
      ) {
        const grossProfit =
          Number(product.sellingPrice) -
          Number(updateData.costPrice ?? product.costPrice) -
          Number(updateData.otherCharges ?? product.otherCharges) -
          Number(product.sellingOtherCharges ?? 0);

        extraUpdate = { grossProfit };
      }

      return await prisma.inventoryProduct.update({
        where: { id },
        data: {
          ...updateData,
          purchaseDate: new Date(updateData.purchaseDate),
          warrantyPurchaseDate: updateData.warrantyPurchaseDate
            ? new Date(updateData.warrantyPurchaseDate)
            : null,
          ...extraUpdate,
        },
        include: { brand: true, category: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }
  async markAsSold(input: MarkAsSoldInput) {
    try {
      const validated = validateOrThrow(markAsSoldSchema, input);
      const { id, ...saleData } = validated;

      const product = await prisma.inventoryProduct.findUnique({
        where: { id },
      });
      if (!product) return throwNotFoundError("Inventory product not found");

      const sellingDate = new Date(saleData.sellingDate);
      const tat = this.calculateTat(product.purchaseDate, sellingDate);
      const grossProfit =
        saleData.sellingPrice -
        Number(product.costPrice) -
        Number(product.otherCharges) -
        (saleData.sellingOtherCharges ?? 0);

      return await prisma.inventoryProduct.update({
        where: { id },
        data: {
          ...saleData,
          sellingDate,
          status: "SOLD",
          tat,
          grossProfit,
          sellingOtherCharges: saleData.sellingOtherCharges ?? 0, // ← add
        },
        include: { brand: true, category: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteInventoryProduct(id: string) {
    try {
      const product = await prisma.inventoryProduct.findUnique({
        where: { id },
      });
      if (!product) return throwNotFoundError("Inventory product not found");

      // Soft delete
      await prisma.inventoryProduct.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: "Inventory product deleted successfully", id };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminInventoryService();
