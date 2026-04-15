export type InvoiceCompanySettings = {
  id: string;
  label: string;
  isDefault: boolean;
  isActive: boolean;
  name: string;
  address: string;
  contact: string;
  email: string;
  gstin: string;
  logoUrl?: string | null;
  stampUrl?: string | null;
  defaultInvoiceTermsBrand: string;
  defaultInvoiceTermsHellofi: string;
  defaultInvoiceTermsNone: string;
  defaultBankDetails: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAllInvoiceSettingsResponse = {
  getInvoiceSettings: InvoiceCompanySettings[];
};

export type GetInvoiceSettingsByIdResponse = {
  getInvoiceSettingsById: InvoiceCompanySettings;
};

export type GetDefaultInvoiceSettingsResponse = {
  getDefaultInvoiceSettings: InvoiceCompanySettings | null;
};
