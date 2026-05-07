import prisma from "@repo/db";
import {
  handleServiceError,
  throwNotFoundError,
  throwInputError,
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

interface InventoryStatus {}

const inventoryInclude = {
  brand: true,
  category: true,
  invoiceItem: {
    select: {
      id: true,
      invoice: {
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          invoiceDate: true,
        },
      },
    },
  },
  // ── Exchange chain ──
  parentInventory: {
    select: {
      id: true,
      productName: true,
      imeiOrSerial: true,
      orderId: true,
      status: true,
    },
  },
  exchangedItems: {
    select: {
      id: true,
      productName: true,
      imeiOrSerial: true,
      orderId: true,
      status: true,
      exchangeValue: true,
      sourceInvoiceId: true,
    },
  },
  sourceInvoice: {
    select: {
      id: true,
      invoiceNumber: true,
      invoiceDate: true,
      status: true,
    },
  },
};

class AdminInventoryService {
  private generateOrderId(imeiOrSerial: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    const imeiSuffix = imeiOrSerial.slice(-5);
    return `HF-${timestamp}-${random}-${imeiSuffix}`;
  }

  // ── Public helper for invoice service ──
  generateExchangeOrderId(imeiOrSerial: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    const suffix = imeiOrSerial.slice(-5);
    return `HF-EX-${timestamp}-${random}-${suffix}`;
  }

  private calculateTat(purchaseDate: Date, sellingDate: Date): number {
    const diff = sellingDate.getTime() - purchaseDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // ── Fetch full exchange chain by rootInventoryId ──
  async getExchangeChain(rootInventoryId: string) {
    try {
      const allMembers = await prisma.inventoryProduct.findMany({
        where: {
          OR: [{ id: rootInventoryId }, { rootInventoryId }],
          isActive: true,
        },
        include: {
          brand: true,
          category: true,
          sourceInvoice: {
            select: { id: true, invoiceNumber: true, invoiceDate: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      // ── Build tree in memory ──
      const buildTree = (
        items: typeof allMembers,
        parentId: string | null = null,
      ): any[] => {
        return items
          .filter((item) => item.parentInventoryId === parentId)
          .map((item) => ({
            ...item,
            children: buildTree(items, item.id),
          }));
      };

      return buildTree(allMembers, null);
    } catch (error) {
      handleServiceError(error);
    }
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
          include: inventoryInclude,
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

  async markAsSoldFromInvoice(
    tx: any,
    inventoryProductId: string,
    saleData: {
      sellingDate: Date;
      sellingPrice: number;
      sellingCustomerName: string;
      sellingCustomerPhone: string;
      sellingCustomerEmail: string;
      sellingCustomerAddress: string;
      paymentMode?: string | null;
      splitPaymentDetails?: string | null;
      invoiceNumber: string;
      costPrice: number;
      otherCharges: number;
    },
  ) {
    const product = await tx.inventoryProduct.findUnique({
      where: { id: inventoryProductId },
    });
    if (!product) return;

    const tat = this.calculateTat(product.purchaseDate, saleData.sellingDate);
    const grossProfit =
      saleData.sellingPrice - saleData.costPrice - saleData.otherCharges;

    return tx.inventoryProduct.update({
      where: { id: inventoryProductId },
      data: {
        status: "SOLD",
        sellingDate: saleData.sellingDate,
        sellingPrice: saleData.sellingPrice,
        sellingCustomerName: saleData.sellingCustomerName,
        sellingCustomerPhone: saleData.sellingCustomerPhone,
        sellingCustomerEmail: saleData.sellingCustomerEmail,
        sellingCustomerAddress: saleData.sellingCustomerAddress,
        paymentMode: saleData.paymentMode as any,
        splitPaymentDetails: saleData.splitPaymentDetails ?? null,
        invoice: saleData.invoiceNumber,
        tat,
        grossProfit,
      },
    });
  }

  async updateInventoryFromInvoice(
    tx: any,
    inventoryProductId: string,
    data: {
      sellingDate: Date;
      sellingPrice: number;
      sellingCustomerName: string;
      sellingCustomerPhone: string;
      sellingCustomerEmail: string;
      sellingCustomerAddress: string;
      paymentMode?: string | null;
      splitPaymentDetails?: string | null;
      invoiceNumber: string;
      costPrice: number;
      otherCharges: number;
      imeiOrSerial?: string;
      purchaseDate: Date;
    },
  ) {
    const product = await tx.inventoryProduct.findUnique({
      where: { id: inventoryProductId },
    });
    if (!product) return;

    const tat = this.calculateTat(data.purchaseDate, data.sellingDate);
    const grossProfit = data.sellingPrice - data.costPrice - data.otherCharges;

    return tx.inventoryProduct.update({
      where: { id: inventoryProductId },
      data: {
        status: "SOLD",
        sellingDate: data.sellingDate,
        sellingPrice: data.sellingPrice,
        sellingCustomerName: data.sellingCustomerName,
        sellingCustomerPhone: data.sellingCustomerPhone,
        sellingCustomerEmail: data.sellingCustomerEmail,
        sellingCustomerAddress: data.sellingCustomerAddress,
        paymentMode: data.paymentMode as any,
        splitPaymentDetails: data.splitPaymentDetails ?? null,
        invoice: data.invoiceNumber,
        imeiOrSerial: data.imeiOrSerial || product.imeiOrSerial,
        tat,
        grossProfit,
      },
    });
  }

  async updateExchangeInventoryFromInvoice(
    tx: any,
    inventoryProductId: string,
    data: {
      productName: string;
      imeiOrSerial?: string;
      ram?: string | null;
      storage?: string | null;
      brandId?: string;
      categoryId?: string;
      exchangeValue?: number;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      customerAddress: string;
      purchaseDate: Date;
    },
  ) {
    const product = await tx.inventoryProduct.findUnique({
      where: { id: inventoryProductId },
    });
    if (!product) return;

    return tx.inventoryProduct.update({
      where: { id: inventoryProductId },
      data: {
        productName: data.productName,
        imeiOrSerial: data.imeiOrSerial || product.imeiOrSerial,
        ram: data.ram ?? product.ram,
        storage: data.storage ?? product.storage,
        brandId: data.brandId || product.brandId,
        categoryId: data.categoryId || product.categoryId,
        exchangeValue: data.exchangeValue ?? product.exchangeValue,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        purchaseDate: data.purchaseDate,
      },
    });
  }

  async getInventoryProductById(id: string) {
    try {
      const product = await prisma.inventoryProduct.findUnique({
        where: { id },
        include: inventoryInclude,
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
        include: inventoryInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getInventoryProductByImei(imeiOrSerial: string) {
    try {
      return await prisma.inventoryProduct.findMany({
        where: { imeiOrSerial, isActive: true },
        include: inventoryInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getInventoryProductForInvoice(imeiOrSerial: string) {
    try {
      const product = await prisma.inventoryProduct.findFirst({
        where: { imeiOrSerial, isActive: true },
        include: {
          brand: true,
          category: true,
          invoiceItem: {
            select: {
              invoice: { select: { invoiceNumber: true, status: true } },
            },
          },
        },
      });

      if (!product) {
        return {
          id: "",
          productName: "",
          imeiOrSerial,
          orderId: "",
          ram: null,
          storage: null,
          costPrice: 0,
          otherCharges: 0,
          brandId: "",
          categoryId: "",
          brand: null,
          category: null,
          status: "NOT_FOUND",
          isEligible: false,
          ineligibleReason: `No product found with IMEI/Serial "${imeiOrSerial}"`,
        };
      }

      if (!product.isActive) {
        return {
          ...product,
          isEligible: false,
          ineligibleReason: "This product is inactive",
        };
      }

      if (product.status === "SOLD") {
        return {
          ...product,
          isEligible: false,
          ineligibleReason: `"${product.productName}" is already sold`,
        };
      }

      if (product.invoiceItem) {
        const inv = product.invoiceItem.invoice;
        return {
          ...product,
          isEligible: false,
          ineligibleReason: `"${product.productName}" is already linked to invoice ${inv.invoiceNumber}`,
        };
      }

      return { ...product, isEligible: true, ineligibleReason: null };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async searchProductNames(
    query: string,
    categoryId?: string,
    brandId?: string,
    page = 1,
  ) {
    const pageSize = 10;
    const safePage = Math.max(1, page ?? 1);
    const skip = (safePage - 1) * pageSize;

    const where: any = {
      productName: { contains: query, mode: "insensitive" },
      status: "ACTIVE",
    };
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;

    const [results, total] = await Promise.all([
      prisma.sellingProduct.findMany({
        where,
        select: { productName: true },
        distinct: ["productName"],
        take: pageSize,
        skip,
      }),
      prisma.sellingProduct.count({ where }),
    ]);

    return {
      names: results.map((r) => r.productName),
      hasMore: skip + pageSize < total,
    };
  }

  async getAvailableForInvoice(filter?: {
    search?: string;
    brandId?: string;
    categoryId?: string;
    page?: number;
    pageSize?: number;
  }) {
    try {
      const page = filter?.page ?? 1;
      const pageSize = filter?.pageSize ?? 20;
      const skip = (page - 1) * pageSize;

      const searchCondition = filter?.search
        ? {
            OR: [
              {
                productName: {
                  contains: filter.search,
                  mode: "insensitive" as const,
                },
              },
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
            ],
          }
        : {};

      const where = {
        isActive: true,
        status: { in: ["NOT_LISTED", "LISTED"] as any },
        invoiceItem: null,
        ...searchCondition,
        ...(filter?.brandId && { brandId: filter.brandId }),
        ...(filter?.categoryId && { categoryId: filter.categoryId }),
      };

      const [items, total] = await Promise.all([
        prisma.inventoryProduct.findMany({
          where,
          include: { brand: true, category: true },
          orderBy: { createdAt: "desc" },
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

  async createInventoryProduct(input: CreateInventoryProductInput) {
    try {
      const validated = validateOrThrow(createInventoryProductSchema, input);

      const existing = await prisma.inventoryProduct.findFirst({
        where: { imeiOrSerial: validated.imeiOrSerial, isActive: true },
      });

      if (existing) {
        if (existing.status !== "SOLD") {
          return throwInputError(
            `Product with IMEI/Serial "${validated.imeiOrSerial}" already exists and is ${existing.status === "NOT_LISTED" ? "not sold yet" : "currently listed"}. Cannot add a duplicate.`,
          );
        }
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
        include: inventoryInclude,
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
        include: inventoryInclude,
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
        include: {
          invoiceItem: {
            include: { invoice: { select: { invoiceNumber: true } } },
          },
        },
      });
      if (!product) return throwNotFoundError("Inventory product not found");

      if (product.invoiceItem) {
        throwInputError(
          `This product is linked to invoice ${product.invoiceItem.invoice.invoiceNumber}. Use the invoice flow instead.`,
        );
        return;
      }

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
          sellingOtherCharges: saleData.sellingOtherCharges ?? 0,
        },
        include: inventoryInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteInventoryProduct(id: string) {
    try {
      const product = await prisma.inventoryProduct.findUnique({
        where: { id },
        include: {
          invoiceItem: {
            include: {
              invoice: { select: { invoiceNumber: true, status: true } },
            },
          },
        },
      });
      if (!product) return throwNotFoundError("Inventory product not found");

      if (product.invoiceItem) {
        const inv = product.invoiceItem.invoice;
        if (inv.status !== "CANCELLED") {
          throwInputError(
            `Cannot delete — linked to invoice ${inv.invoiceNumber}. Cancel the invoice first.`,
          );
          return;
        }
      }

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
