import prisma from "@repo/db";
import {
  handleServiceError,
  throwNotFoundError,
  throwInputError,
} from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "@repo/validations";
import AdminInventoryService from "./admin.inventory.service";

const invoiceInclude = {
  items: {
    include: {
      inventoryProduct: {
        include: { brand: true, category: true },
      },
    },
  },
  exchangeItems: true,
  companySettings: true,
  exchangedInventory: {
    include: { brand: true, category: true },
  },
};

class AdminInvoiceService {
  async getInvoices(filter?: {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
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

      const where: any = {};

      if (filter?.search) {
        where.OR = [
          { invoiceNumber: { contains: filter.search, mode: "insensitive" } },
          { clientName: { contains: filter.search, mode: "insensitive" } },
          { clientContact: { contains: filter.search, mode: "insensitive" } },
          { clientEmail: { contains: filter.search, mode: "insensitive" } },
        ];
      }

      if (filter?.status) where.status = filter.status;

      if (filter?.dateFrom || filter?.dateTo) {
        where.invoiceDate = {
          ...(filter.dateFrom && { gte: new Date(filter.dateFrom) }),
          ...(filter.dateTo && { lte: new Date(filter.dateTo) }),
        };
      }

      const [items, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: invoiceInclude,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.invoice.count({ where }),
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

  async getInvoiceById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: invoiceInclude,
    });
  }

  async getInvoiceByNumber(invoiceNumber: string) {
    return prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: invoiceInclude,
    });
  }

  async getNextInvoiceNumber(): Promise<string> {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const financialYear =
        month >= 4
          ? `${String(year).slice(2)}-${String(year + 1).slice(2)}`
          : `${String(year - 1).slice(2)}-${String(year).slice(2)}`;

      const counter = await prisma.invoiceCounter.findUnique({
        where: { financialYear },
      });
      const nextNumber = (counter?.lastNumber ?? 0) + 1;
      const padded = String(nextNumber).padStart(6, "0");
      return `HFI-${padded}/${financialYear}`;
    } catch (error) {
      handleServiceError(error);
      return "";
    }
  }

  async createInvoice(input: CreateInvoiceInput) {
    try {
      const validated = validateOrThrow(createInvoiceSchema, input);
      const { items, exchangeItems, ...invoiceData } = validated;

      // ── Calculate total exchange value from items ──
      const totalExchangeValue = (exchangeItems ?? []).reduce(
        (s, i) => s + (Number(i.exchangeValue) || 0),
        0,
      );
      invoiceData.exchangeValue = totalExchangeValue;
      invoiceData.amountPaid = Math.max(
        0,
        invoiceData.totalAmount - totalExchangeValue,
      );

      const isExchange = invoiceData.saleType === "EXCHANGE";

      console.log("🧾 createInvoice called, saleType:", invoiceData.saleType);
      console.log(
        "🧾 Items received:",
        items.map((i) => ({
          product: i.product,
          inventoryProductId: i.inventoryProductId ?? "NONE",
          serialNumber: i.serialNumber ?? "NONE",
        })),
      );
      console.log("💱 Total exchange value:", totalExchangeValue);
      console.log("💰 Amount paid:", invoiceData.amountPaid);

      // ── 1. Validate company settings ──
      const settings = await prisma.invoiceCompanySettings.findUnique({
        where: { id: validated.companySettingsId },
      });
      if (!settings) return throwNotFoundError("Company settings not found");

      // ── 2. Check duplicate invoice number ──
      const existingByNumber = await prisma.invoice.findUnique({
        where: { invoiceNumber: invoiceData.invoiceNumber },
      });
      if (existingByNumber) {
        throwInputError(
          `Invoice number ${invoiceData.invoiceNumber} already exists`,
        );
        return;
      }

      // ── 3. Resolve inventory product for each item ──
      const resolvedItems: ((typeof items)[0] & {
        resolvedInventoryId?: string;
      })[] = [];

      for (const item of items) {
        let inventoryId = item.inventoryProductId ?? null;

        if (!inventoryId && item.serialNumber) {
          const foundByImei = await prisma.inventoryProduct.findFirst({
            where: {
              imeiOrSerial: item.serialNumber,
              isActive: true,
              status: { not: "SOLD" },
            },
            include: {
              invoiceItem: {
                select: { invoice: { select: { invoiceNumber: true } } },
              },
            },
          });

          if (foundByImei) {
            console.log(
              `🔍 Found by IMEI "${item.serialNumber}":`,
              foundByImei.productName,
            );
            if (foundByImei.invoiceItem) {
              throwInputError(
                `"${foundByImei.productName}" is already linked to invoice ${foundByImei.invoiceItem.invoice.invoiceNumber}`,
              );
              return;
            }
            inventoryId = foundByImei.id;
          } else {
            console.log(
              `⚠️ No active unsold product found for IMEI "${item.serialNumber}" — saving without inventory link`,
            );
          }
        }

        resolvedItems.push({
          ...item,
          resolvedInventoryId: inventoryId ?? undefined,
        });
      }

      // ── 4. Validate all resolved inventory products ──
      const inventoryProductIds = resolvedItems
        .map((item) => item.resolvedInventoryId)
        .filter(Boolean) as string[];

      console.log("🔗 Resolved inventory product IDs:", inventoryProductIds);

      const inventoryProducts =
        inventoryProductIds.length > 0
          ? await prisma.inventoryProduct.findMany({
              where: { id: { in: inventoryProductIds } },
              include: {
                invoiceItem: {
                  select: { invoice: { select: { invoiceNumber: true } } },
                },
              },
            })
          : [];

      console.log(
        "📦 Inventory products fetched:",
        inventoryProducts.map((p) => ({
          id: p.id,
          productName: p.productName,
          status: p.status,
        })),
      );

      for (const item of resolvedItems) {
        if (!item.resolvedInventoryId) {
          console.log("⚠️ Item has no inventory link:", item.product);
          continue;
        }

        const inv = inventoryProducts.find(
          (p) => p.id === item.resolvedInventoryId,
        );

        if (!inv) {
          throwInputError(
            `Inventory product not found for item "${item.product}"`,
          );
          return;
        }
        if (!inv.isActive) {
          throwInputError(`"${inv.productName}" is inactive`);
          return;
        }
        if (inv.status === "SOLD") {
          throwInputError(`"${inv.productName}" is already sold`);
          return;
        }
        if (inv.invoiceItem) {
          throwInputError(
            `"${inv.productName}" is already linked to invoice ${inv.invoiceItem.invoice.invoiceNumber}`,
          );
          return;
        }

        console.log(
          `✅ Inventory product valid (${isExchange ? "exchange — no SOLD update" : "direct — will mark SOLD"}):`,
          inv.productName,
        );
      }

      // ── 5. Compute custom terms ──
      let defaultTerms = settings.defaultInvoiceTermsBrand;
      if (invoiceData.warrantyType === "HELLOFI") {
        defaultTerms = settings.defaultInvoiceTermsHellofi.replace(
          "{months}",
          String(invoiceData.warrantyMonths ?? 3),
        );
      } else if (invoiceData.warrantyType === "NONE") {
        defaultTerms = settings.defaultInvoiceTermsNone;
      }

      const customInvoiceTerms =
        invoiceData.invoiceTerms.trim() === defaultTerms.trim()
          ? null
          : invoiceData.invoiceTerms;

      const customBankDetails =
        invoiceData.bankDetails.trim() === settings.defaultBankDetails.trim()
          ? null
          : invoiceData.bankDetails;

      // ── 6. Financial year for counter ──
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const financialYear =
        month >= 4
          ? `${String(year).slice(2)}-${String(year + 1).slice(2)}`
          : `${String(year - 1).slice(2)}-${String(year).slice(2)}`;

      const sellingDate = new Date(invoiceData.invoiceDate);

      // ── 7. Transaction ──
      const invoice = await prisma.$transaction(async (tx) => {
        console.log("💾 Creating invoice in transaction...");

        const created = await tx.invoice.create({
          data: {
            invoiceNumber: invoiceData.invoiceNumber,
            invoiceDate: sellingDate,
            companySettingsId: invoiceData.companySettingsId,
            clientName: invoiceData.clientName,
            clientAddress: invoiceData.clientAddress,
            clientEmail: invoiceData.clientEmail ?? "",
            clientContact: invoiceData.clientContact,
            clientGstin: invoiceData.clientGstin,
            isInsideBangalore: invoiceData.isInsideBangalore,
            paidBy: invoiceData.paidBy as any,
            splitPaymentDetails:
              invoiceData.paidBy === "SPLIT_PAYMENT"
                ? (invoiceData.splitPaymentDetails ?? null)
                : null,
            saleType: invoiceData.saleType as any,
            warrantyType: invoiceData.warrantyType as any,
            warrantyMonths: invoiceData.warrantyMonths,
            grossValue: invoiceData.grossValue,
            taxAmount: invoiceData.taxAmount,
            totalAmount: invoiceData.totalAmount,
            exchangeValue: totalExchangeValue,
            amountPaid: invoiceData.amountPaid,
            cgst: invoiceData.cgst,
            sgst: invoiceData.sgst,
            igst: invoiceData.igst,
            customInvoiceTerms,
            customBankDetails,
            status: "DRAFT",
            items: {
              create: resolvedItems.map((item, index) => ({
                inventoryProductId: item.resolvedInventoryId ?? null,
                product: item.product,
                serialNumber: item.serialNumber,
                hsnSac: item.hsnSac,
                qty: item.qty,
                uom: item.uom,
                rate: item.rate,
                total: item.total,
                discount: item.discount,
                gross: item.gross,
                gstAmount: item.gstAmount,
                cgstPercent: item.cgstPercent,
                cgstAmount: item.cgstAmount,
                sgstPercent: item.sgstPercent,
                sgstAmount: item.sgstAmount,
                igstPercent: item.igstPercent,
                igstAmount: item.igstAmount,
                sortOrder: item.sortOrder ?? index,
              })),
            },
            exchangeItems: {
              create: (exchangeItems ?? []).map(
                ({ productName, ram, storage, ...rest }: any) => ({
                  ...rest,
                  ram: ram || null,
                  storage: storage || null,
                  productName, // ← plain name, no (ram/storage) appended
                }),
              ),
            },
          },
          include: invoiceInclude,
        });

        console.log("✅ Invoice created:", created.invoiceNumber);

        // ── For DIRECT sales — mark inventory as SOLD ──
        if (!isExchange) {
          for (const item of resolvedItems) {
            if (!item.resolvedInventoryId) {
              console.log(
                "⚠️ Skipping item with no inventory link:",
                item.product,
              );
              continue;
            }

            const inv = inventoryProducts.find(
              (p) => p.id === item.resolvedInventoryId,
            )!;
            console.log("🔄 Marking as SOLD:", inv.productName, inv.id);

            await AdminInventoryService.markAsSoldFromInvoice(tx, inv.id, {
              sellingDate,
              sellingPrice: item.total,
              sellingCustomerName: invoiceData.clientName,
              sellingCustomerPhone: invoiceData.clientContact,
              sellingCustomerEmail: invoiceData.clientEmail ?? "",
              sellingCustomerAddress: invoiceData.clientAddress,
              paymentMode: invoiceData.paidBy,
              splitPaymentDetails:
                invoiceData.paidBy === "SPLIT_PAYMENT"
                  ? (invoiceData.splitPaymentDetails ?? null)
                  : null,
              invoiceNumber: invoiceData.invoiceNumber,
              costPrice: Number(inv.costPrice),
              otherCharges: Number(inv.otherCharges),
            });

            console.log("✅ Successfully marked as SOLD:", inv.productName);
          }
        }

        // ── For EXCHANGE sales — create inventory entries for exchanged devices ──
        if (isExchange && exchangeItems && exchangeItems.length > 0) {
          console.log(
            "🔄 Creating exchange inventory entries for",
            exchangeItems.length,
            "items",
          );

          const parentInventoryId =
            resolvedItems.find((r) => r.resolvedInventoryId)
              ?.resolvedInventoryId ?? null;

          const parentProduct = parentInventoryId
            ? inventoryProducts.find((p) => p.id === parentInventoryId)
            : null;

          const rootInventoryId = parentProduct
            ? (parentProduct.rootInventoryId ?? parentProduct.id)
            : null;

          for (const exItem of exchangeItems) {
            const orderId = AdminInventoryService.generateExchangeOrderId(
              exItem.serialNumber ?? "EXCHANGE",
            );

            await tx.inventoryProduct.create({
              data: {
                imeiOrSerial: exItem.serialNumber ?? `EX-${Date.now()}`,
                orderId,
                purchaseDate: sellingDate,
                productName: exItem.productName,
                ram: exItem.ram ?? null,
                storage: exItem.storage ?? null,
                costPrice: 0,
                otherCharges: 0,
                brandId:
                  exItem.brandId ||
                  parentProduct?.brandId ||
                  inventoryProducts[0]?.brandId ||
                  "",
                categoryId:
                  exItem.categoryId ||
                  parentProduct?.categoryId ||
                  inventoryProducts[0]?.categoryId ||
                  "",
                customerName: invoiceData.clientName,
                customerEmail: invoiceData.clientEmail ?? "",
                customerPhone: invoiceData.clientContact,
                customerAddress: invoiceData.clientAddress,
                status: "NOT_LISTED",
                isExchangeItem: true,
                exchangeValue: exItem.exchangeValue ?? 0,
                parentInventoryId: parentInventoryId,
                rootInventoryId: rootInventoryId,
                sourceInvoiceId: created.id,
                notes: `Exchange item from invoice ${invoiceData.invoiceNumber}`,
              },
            });

            console.log(
              "✅ Exchange inventory created for:",
              exItem.productName,
            );
          }
        }

        // ── For EXCHANGE sales — mark inventory as SOLD ──
        if (isExchange) {
          const totalGross = resolvedItems.reduce(
            (s, i) => s + (Number(i.gross) || 0),
            0,
          );

          console.log("💰 Exchange selling price calculation:");
          console.log("  totalAmount:", invoiceData.totalAmount);
          console.log("  exchangeValue:", totalExchangeValue);
          console.log("  amountPaid:", invoiceData.amountPaid);
          console.log("  totalGross:", totalGross);

          for (const item of resolvedItems) {
            if (!item.resolvedInventoryId) continue;

            const inv = inventoryProducts.find(
              (p) => p.id === item.resolvedInventoryId,
            )!;

            const itemShare =
              totalGross > 0
                ? (Number(item.gross) / totalGross) * invoiceData.amountPaid
                : invoiceData.amountPaid;

            console.log(`  item: ${item.product}`);
            console.log(`  item.gross: ${item.gross}`);
            console.log(`  itemShare: ${itemShare}`);

            await AdminInventoryService.markAsSoldFromInvoice(tx, inv.id, {
              sellingDate,
              sellingPrice: itemShare,
              sellingCustomerName: invoiceData.clientName,
              sellingCustomerPhone: invoiceData.clientContact,
              sellingCustomerEmail: invoiceData.clientEmail ?? "",
              sellingCustomerAddress: invoiceData.clientAddress,
              paymentMode: invoiceData.paidBy,
              splitPaymentDetails:
                invoiceData.paidBy === "SPLIT_PAYMENT"
                  ? (invoiceData.splitPaymentDetails ?? null)
                  : null,
              invoiceNumber: invoiceData.invoiceNumber,
              costPrice: Number(inv.costPrice),
              otherCharges: Number(inv.otherCharges),
            });

            console.log(
              "✅ Marked as SOLD (exchange):",
              inv.productName,
              "sellingPrice:",
              itemShare,
            );
          }
        }

        // ── Increment counter ──
        await tx.invoiceCounter.upsert({
          where: { financialYear },
          update: { lastNumber: { increment: 1 } },
          create: { financialYear, lastNumber: 1 },
        });

        console.log("✅ Invoice counter incremented for:", financialYear);
        return created;
      });

      console.log("🎉 createInvoice complete:", invoice?.invoiceNumber);
      return invoice;
    } catch (error) {
      console.log("❌ createInvoice error:", error);
      handleServiceError(error);
    }
  }

  async updateInvoice(input: UpdateInvoiceInput) {
    try {
      const validated = validateOrThrow(updateInvoiceSchema, input);
      const { id, items, exchangeItems, ...updateData } = validated;

      // ── Calculate total exchange value from items ──
      const totalExchangeValue = (exchangeItems ?? []).reduce(
        (s, i) => s + (Number(i.exchangeValue) || 0),
        0,
      );
      if (exchangeItems && exchangeItems.length > 0) {
        updateData.exchangeValue = totalExchangeValue;
        if (updateData.totalAmount) {
          updateData.amountPaid = Math.max(
            0,
            updateData.totalAmount - totalExchangeValue,
          );
        }
      }

      console.log("💱 Update — total exchange value:", totalExchangeValue);

      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          items: { include: { inventoryProduct: true } },
        },
      });
      if (!invoice) return throwNotFoundError("Invoice not found");
      if (invoice.status === "FINALIZED")
        throwInputError("Cannot edit a finalized invoice");
      if (invoice.status === "CANCELLED")
        throwInputError("Cannot edit a cancelled invoice");

      let customInvoiceTerms = invoice.customInvoiceTerms;
      let customBankDetails = invoice.customBankDetails;

      if (updateData.invoiceTerms || updateData.bankDetails) {
        const settings = await prisma.invoiceCompanySettings.findUnique({
          where: { id: invoice.companySettingsId },
        });

        if (settings) {
          if (updateData.invoiceTerms) {
            let defaultTerms = settings.defaultInvoiceTermsBrand;
            const warrantyType =
              updateData.warrantyType ?? invoice.warrantyType;
            const warrantyMonths =
              updateData.warrantyMonths ?? invoice.warrantyMonths;

            if (warrantyType === "HELLOFI") {
              defaultTerms = settings.defaultInvoiceTermsHellofi.replace(
                "{months}",
                String(warrantyMonths ?? 3),
              );
            } else if (warrantyType === "NONE") {
              defaultTerms = settings.defaultInvoiceTermsNone;
            }

            customInvoiceTerms =
              updateData.invoiceTerms.trim() === defaultTerms.trim()
                ? null
                : updateData.invoiceTerms;
          }

          if (updateData.bankDetails) {
            customBankDetails =
              updateData.bankDetails.trim() ===
              settings.defaultBankDetails.trim()
                ? null
                : updateData.bankDetails;
          }
        }
      }

      const { invoiceTerms, bankDetails, ...restUpdateData } = updateData;

      const isExchange =
        (restUpdateData.saleType ?? invoice.saleType) === "EXCHANGE";

      const resolvedItems = items ?? [];
      const inventoryProductIds = resolvedItems
        .map((i) => i.inventoryProductId)
        .filter(Boolean) as string[];

      const inventoryProducts =
        inventoryProductIds.length > 0
          ? await prisma.inventoryProduct.findMany({
              where: { id: { in: inventoryProductIds } },
            })
          : [];

      const totalGross = resolvedItems.reduce(
        (s, i) => s + (Number(i.gross) || 0),
        0,
      );

      const finalAmountPaid =
        exchangeItems && exchangeItems.length > 0
          ? Math.max(
              0,
              (restUpdateData.totalAmount ?? invoice.totalAmount) -
                totalExchangeValue,
            )
          : (restUpdateData.amountPaid ?? invoice.amountPaid);

      const sellingDate = restUpdateData.invoiceDate
        ? new Date(restUpdateData.invoiceDate)
        : invoice.invoiceDate;

      return await prisma.$transaction(async (tx) => {
        const updated = await tx.invoice.update({
          where: { id },
          data: {
            ...restUpdateData,
            customInvoiceTerms,
            customBankDetails,
            exchangeValue:
              exchangeItems && exchangeItems.length > 0
                ? totalExchangeValue
                : (restUpdateData.exchangeValue ?? invoice.exchangeValue),
            amountPaid: finalAmountPaid,
            splitPaymentDetails:
              restUpdateData.paidBy === "SPLIT_PAYMENT"
                ? (restUpdateData.splitPaymentDetails ?? null)
                : null,
            invoiceDate: restUpdateData.invoiceDate
              ? new Date(restUpdateData.invoiceDate)
              : undefined,
            ...(items && {
              items: {
                deleteMany: {},
                create: items.map((item, index) => ({
                  inventoryProductId: item.inventoryProductId ?? null,
                  product: item.product,
                  serialNumber: item.serialNumber,
                  hsnSac: item.hsnSac,
                  qty: item.qty,
                  uom: item.uom,
                  rate: item.rate,
                  total: item.total,
                  discount: item.discount,
                  gross: item.gross,
                  gstAmount: item.gstAmount,
                  cgstPercent: item.cgstPercent,
                  cgstAmount: item.cgstAmount,
                  sgstPercent: item.sgstPercent,
                  sgstAmount: item.sgstAmount,
                  igstPercent: item.igstPercent,
                  igstAmount: item.igstAmount,
                  sortOrder: item.sortOrder ?? index,
                })),
              },
            }),
            ...(exchangeItems && {
              exchangeItems: {
                deleteMany: {},
                create: exchangeItems.map(
                  ({ productName, ram, storage, ...rest }: any) => ({
                    ...rest,
                    ram: ram || null,
                    storage: storage || null,
                    productName, // ← plain name, no (ram/storage) appended
                  }),
                ),
              },
            }),
          },
          include: invoiceInclude,
        });

        // ── Update main inventory products ──
        if (items && inventoryProducts.length > 0) {
          for (const item of resolvedItems) {
            if (!item.inventoryProductId) continue;

            const inv = inventoryProducts.find(
              (p) => p.id === item.inventoryProductId,
            );
            if (!inv) continue;

            const itemShare =
              totalGross > 0
                ? (Number(item.gross) / totalGross) * finalAmountPaid
                : finalAmountPaid;

            await AdminInventoryService.updateInventoryFromInvoice(tx, inv.id, {
              sellingDate,
              sellingPrice: itemShare,
              sellingCustomerName:
                restUpdateData.clientName ?? invoice.clientName,
              sellingCustomerPhone:
                restUpdateData.clientContact ?? invoice.clientContact,
              sellingCustomerEmail:
                restUpdateData.clientEmail ?? invoice.clientEmail,
              sellingCustomerAddress:
                restUpdateData.clientAddress ?? invoice.clientAddress,
              paymentMode: restUpdateData.paidBy ?? invoice.paidBy,
              splitPaymentDetails:
                (restUpdateData.paidBy ?? invoice.paidBy) === "SPLIT_PAYMENT"
                  ? (restUpdateData.splitPaymentDetails ??
                    invoice.splitPaymentDetails ??
                    null)
                  : null,
              invoiceNumber: invoice.invoiceNumber,
              costPrice: Number(inv.costPrice),
              otherCharges: Number(inv.otherCharges),
              imeiOrSerial: item.serialNumber,
              purchaseDate: new Date(inv.purchaseDate),
            });

            console.log(
              "✅ Updated inventory:",
              inv.productName,
              "sellingPrice:",
              itemShare,
            );
          }
        }

        // ── Update exchange inventory entries ──
        if (exchangeItems && exchangeItems.length > 0) {
          const existingExchangeInventory =
            await prisma.inventoryProduct.findMany({
              where: {
                sourceInvoiceId: id,
                isExchangeItem: true,
                isActive: true,
              },
              orderBy: { createdAt: "asc" },
            });

          for (let i = 0; i < exchangeItems.length; i++) {
            const exItem = exchangeItems[i] as any;
            const existing = existingExchangeInventory[i];
            if (!existing) continue;

            await AdminInventoryService.updateExchangeInventoryFromInvoice(
              tx,
              existing.id,
              {
                productName: exItem.productName,
                imeiOrSerial: exItem.serialNumber,
                ram: exItem.ram || null,
                storage: exItem.storage || null,
                brandId: exItem.brandId,
                categoryId: exItem.categoryId,
                exchangeValue: exItem.exchangeValue,
                customerName: restUpdateData.clientName ?? invoice.clientName,
                customerEmail:
                  restUpdateData.clientEmail ?? invoice.clientEmail,
                customerPhone:
                  restUpdateData.clientContact ?? invoice.clientContact,
                customerAddress:
                  restUpdateData.clientAddress ?? invoice.clientAddress,
                purchaseDate: sellingDate,
              },
            );

            console.log("✅ Updated exchange inventory:", exItem.productName);
          }
        }

        return updated;
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async finalizeInvoice(id: string) {
    try {
      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice) return throwNotFoundError("Invoice not found");
      if (invoice.status === "FINALIZED")
        throwInputError("Invoice is already finalized");
      if (invoice.status === "CANCELLED")
        throwInputError("Cannot finalize a cancelled invoice");

      return prisma.invoice.update({
        where: { id },
        data: { status: "FINALIZED" },
        include: invoiceInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async cancelInvoice(id: string) {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: { items: { include: { inventoryProduct: true } } },
      });
      if (!invoice) return throwNotFoundError("Invoice not found");
      if (invoice.status === "FINALIZED")
        throwInputError(
          "Cannot cancel a finalized invoice. Create a new invoice instead.",
        );

      if (invoice.status === "DRAFT") {
        const linkedItems = invoice.items.filter(
          (item) => item.inventoryProductId,
        );

        const itemsToReverse = invoice.saleType === "DIRECT" ? linkedItems : [];

        // ── Also soft-delete exchange inventory entries created from this invoice ──
        const exchangeInventoryIds = await prisma.inventoryProduct.findMany({
          where: {
            sourceInvoiceId: id,
            isExchangeItem: true,
            status: "NOT_LISTED", // only if not already sold
          },
          select: { id: true },
        });

        await prisma.$transaction([
          prisma.invoice.update({
            where: { id },
            data: { status: "CANCELLED" },
          }),
          ...itemsToReverse.map((item) =>
            prisma.inventoryProduct.update({
              where: { id: item.inventoryProductId! },
              data: {
                status: "NOT_LISTED",
                sellingDate: null,
                sellingPrice: null,
                sellingCustomerName: null,
                sellingCustomerPhone: null,
                sellingCustomerEmail: null,
                sellingCustomerAddress: null,
                paymentMode: null,
                invoice: null,
                tat: null,
                grossProfit: null,
              },
            }),
          ),
          // ── Soft-delete exchange inventory entries ──
          ...exchangeInventoryIds.map((ex) =>
            prisma.inventoryProduct.update({
              where: { id: ex.id },
              data: { isActive: false },
            }),
          ),
        ]);

        return prisma.invoice.findUnique({
          where: { id },
          include: invoiceInclude,
        });
      }

      return prisma.invoice.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: invoiceInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminInvoiceService();
