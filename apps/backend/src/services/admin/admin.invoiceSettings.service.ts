import prisma from "@repo/db";
import { handleServiceError, throwNotFoundError } from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import {
  createInvoiceSettingsSchema,
  updateInvoiceSettingsSchema,
  CreateInvoiceSettingsInput,
  UpdateInvoiceSettingsInput,
} from "@repo/validations";

class AdminInvoiceSettingsService {
  async getAllInvoiceSettings() {
    try {
      return await prisma.invoiceCompanySettings.findMany({
        where: { isActive: true },
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getInvoiceSettingsById(id: string) {
    try {
      const settings = await prisma.invoiceCompanySettings.findUnique({
        where: { id },
      });
      if (!settings) return throwNotFoundError("Invoice settings not found");
      return settings;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getDefaultInvoiceSettings() {
    try {
      return await prisma.invoiceCompanySettings.findFirst({
        where: { isDefault: true, isActive: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createInvoiceSettings(input: CreateInvoiceSettingsInput) {
    try {
      const validated = validateOrThrow(createInvoiceSettingsSchema, input);

      // If isDefault — unset all others first
      if (validated.isDefault) {
        await prisma.invoiceCompanySettings.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      return await prisma.invoiceCompanySettings.create({
        data: {
          label: validated.label,
          isDefault: validated.isDefault ?? false,
          name: validated.name,
          address: validated.address,
          contact: validated.contact,
          email: validated.email,
          gstin: validated.gstin,
          logoUrl: validated.logoUrl,
          stampUrl: validated.stampUrl,
          defaultInvoiceTermsBrand: validated.defaultInvoiceTermsBrand,
          defaultInvoiceTermsHellofi: validated.defaultInvoiceTermsHellofi,
          defaultInvoiceTermsNone: validated.defaultInvoiceTermsNone,
          defaultBankDetails: validated.defaultBankDetails,
        },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateInvoiceSettings(input: UpdateInvoiceSettingsInput) {
    try {
      const validated = validateOrThrow(updateInvoiceSettingsSchema, input);
      const { id, ...updateData } = validated;

      const existing = await prisma.invoiceCompanySettings.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Invoice settings not found");

      // If setting as default — unset all others first
      if (updateData.isDefault) {
        await prisma.invoiceCompanySettings.updateMany({
          where: { isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      return await prisma.invoiceCompanySettings.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteInvoiceSettings(id: string) {
    try {
      const existing = await prisma.invoiceCompanySettings.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Invoice settings not found");

      if (existing.isDefault) {
        throw new Error(
          "Cannot delete default settings. Set another as default first.",
        );
      }

      // Soft delete
      await prisma.invoiceCompanySettings.update({
        where: { id },
        data: { isActive: false },
      });

      return { message: "Invoice settings deleted successfully", id };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async setDefaultInvoiceSettings(id: string) {
    try {
      const existing = await prisma.invoiceCompanySettings.findUnique({
        where: { id },
      });
      if (!existing) return throwNotFoundError("Invoice settings not found");

      // Unset all current defaults
      await prisma.invoiceCompanySettings.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });

      // Set new default
      return await prisma.invoiceCompanySettings.update({
        where: { id },
        data: { isDefault: true },
      });
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminInvoiceSettingsService();
