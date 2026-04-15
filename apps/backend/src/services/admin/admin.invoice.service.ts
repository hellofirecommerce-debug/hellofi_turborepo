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
          include: {
            items: true,
            exchangeItems: true,
            companySettings: true, // ← add this
          },
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
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        exchangeItems: true,
        companySettings: true,
      },
    });
    return invoice;
  }

  async getInvoiceByNumber(invoiceNumber: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        items: true,
        exchangeItems: true,
        companySettings: true, // ← add
      },
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

      // ── Just check if counter exists ──
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

      const settings = await prisma.invoiceCompanySettings.findUnique({
        where: { id: validated.companySettingsId },
      });
      if (!settings) return throwNotFoundError("Company settings not found");

      const existing = await prisma.invoice.findUnique({
        where: { invoiceNumber: invoiceData.invoiceNumber },
      });
      if (existing)
        throwInputError(
          `Invoice number ${invoiceData.invoiceNumber} already exists`,
        );

      // ── Compare terms with settings default ──
      // Get what the default terms SHOULD be for this warranty type
      let defaultTerms = settings.defaultInvoiceTermsBrand;
      if (invoiceData.warrantyType === "HELLOFI") {
        defaultTerms = settings.defaultInvoiceTermsHellofi.replace(
          "{months}",
          String(invoiceData.warrantyMonths ?? 3),
        );
      } else if (invoiceData.warrantyType === "NONE") {
        defaultTerms = settings.defaultInvoiceTermsNone;
      }

      // Only save customInvoiceTerms if admin added extra points
      const customInvoiceTerms =
        invoiceData.invoiceTerms.trim() === defaultTerms.trim()
          ? null // same as default — no need to store
          : invoiceData.invoiceTerms; // admin added custom points — store

      // Only save customBankDetails if admin changed it
      const customBankDetails =
        invoiceData.bankDetails.trim() === settings.defaultBankDetails.trim()
          ? null // same as default — no need to store
          : invoiceData.bankDetails; // admin changed it — store

      // ── Save to DB ──
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: invoiceData.invoiceNumber,
          invoiceDate: new Date(invoiceData.invoiceDate),
          companySettingsId: invoiceData.companySettingsId,
          // ── No company snapshot fields — read from settings ──
          clientName: invoiceData.clientName,
          clientAddress: invoiceData.clientAddress,
          clientEmail: invoiceData.clientEmail ?? "",
          clientContact: invoiceData.clientContact,
          clientGstin: invoiceData.clientGstin,
          isInsideBangalore: invoiceData.isInsideBangalore,
          paidBy: invoiceData.paidBy,
          saleType: invoiceData.saleType as any,
          warrantyType: invoiceData.warrantyType as any,
          warrantyMonths: invoiceData.warrantyMonths,
          grossValue: invoiceData.grossValue,
          taxAmount: invoiceData.taxAmount,
          totalAmount: invoiceData.totalAmount,
          exchangeValue: invoiceData.exchangeValue,
          amountPaid: invoiceData.amountPaid,
          cgst: invoiceData.cgst,
          sgst: invoiceData.sgst,
          igst: invoiceData.igst,
          customInvoiceTerms, // null if same as settings
          customBankDetails, // null if same as settings
          status: "DRAFT",
          items: {
            create: items.map((item, index) => ({
              ...item,
              sortOrder: item.sortOrder ?? index,
            })),
          },
          exchangeItems: {
            create: exchangeItems ?? [],
          },
        },
        include: { items: true, exchangeItems: true, companySettings: true },
      });

      // ── Increment counter after successful save ──
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const financialYear =
        month >= 4
          ? `${String(year).slice(2)}-${String(year + 1).slice(2)}`
          : `${String(year - 1).slice(2)}-${String(year).slice(2)}`;

      await prisma.invoiceCounter.upsert({
        where: { financialYear },
        update: { lastNumber: { increment: 1 } },
        create: { financialYear, lastNumber: 1 },
      });

      return invoice;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateInvoice(input: UpdateInvoiceInput) {
    try {
      const validated = validateOrThrow(updateInvoiceSchema, input);
      const { id, items, exchangeItems, ...updateData } = validated;

      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice) return throwNotFoundError("Invoice not found");
      if (invoice.status === "FINALIZED")
        throwInputError("Cannot edit a finalized invoice");
      if (invoice.status === "CANCELLED")
        throwInputError("Cannot edit a cancelled invoice");

      // ── Smart terms comparison (same as createInvoice) ──
      let customInvoiceTerms = invoice.customInvoiceTerms; // keep existing by default
      let customBankDetails = invoice.customBankDetails; // keep existing by default

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

      // ── Remove invoiceTerms/bankDetails from updateData ──
      // since we store them as customInvoiceTerms/customBankDetails
      const { invoiceTerms, bankDetails, ...restUpdateData } = updateData;

      return prisma.invoice.update({
        where: { id },
        data: {
          ...restUpdateData,
          customInvoiceTerms,
          customBankDetails,
          invoiceDate: restUpdateData.invoiceDate
            ? new Date(restUpdateData.invoiceDate)
            : undefined,
          ...(items && {
            items: {
              deleteMany: {},
              create: items.map((item, index) => ({
                ...item,
                sortOrder: item.sortOrder ?? index,
              })),
            },
          }),
          ...(exchangeItems && {
            exchangeItems: {
              deleteMany: {},
              create: exchangeItems,
            },
          }),
        },
        include: { items: true, exchangeItems: true, companySettings: true },
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
        include: { items: true, exchangeItems: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async cancelInvoice(id: string) {
    try {
      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice) return throwNotFoundError("Invoice not found");
      if (invoice.status === "FINALIZED")
        throwInputError(
          "Cannot cancel a finalized invoice. Create a new invoice instead.",
        );

      return prisma.invoice.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: { items: true, exchangeItems: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminInvoiceService();
