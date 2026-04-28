"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@apollo/client/react";
import { InvoiceTopBar } from "./components/InvoiceTopBar";
import { InvoiceLayout } from "./components/InvoiceLayout";
import { InvoiceForm } from "./components/InvoiceForm";
import { InvoicePreviewWrapper } from "./components/InvoicePreviewWrapper";
import { GET_ALL_INVOICE_SETTINGS } from "../../../../../lib/graphql/queries/invoiceSettings.queries";
import { GET_NEXT_INVOICE_NUMBER } from "../../../../../lib/graphql/queries/invoice.queries";
import { InvoiceCreatePageSkeleton } from "../components/InvoiceCreatePageSkeleton";
import {
  GetAllInvoiceSettingsResponse,
  InvoiceCompanySettings,
} from "../../settings/types";
import { PageHeader } from "../../../../../components/ui/PageHeader";

export type InvoiceView = "form" | "both" | "preview";

export type InvoiceData = {
  invoiceNumber: string;
  date: string;
  companySettingsId: string;
  billingAddress: {
    name: string;
    address: string;
    email: string;
    contactNumber: string;
    gstNumber: string;
    isInsideBangalore: boolean;
    paidBy: string;
    splitPaymentDetails: string;
  };
  invoiceDetails: {
    invoiceNumber: string;
    invoiceDate: string;
  };
  warrantyType: "brand" | "hellofi" | "none";
  warrantyMonths: number | null;
  saleType: "direct" | "exchange";
  // In InvoiceData type — replace items with this:
  items: {
    id: string;
    inventoryProductId?: string;
    product: string;
    serialNumber: string;
    hsnSac: string;
    qty: number;
    uom: string;
    rate: number;
    total: number;
    discount: number;
    gstAmount: number;
    gross: number;
    cgstPercent: number;
    cgstAmount: number;
    sgstPercent: number;
    sgstAmount: number;
    igstPercent: number;
    igstAmount: number;
    sortOrder: number;
  }[];
  exchangeItems: {
    id: string;
    productName: string;
    serialNumber: string;
    brandId: string;
    categoryId: string;
    ram: string;
    storage: string;
    exchangeValue: number;
  }[];
  exchangeValue: number;
  gstCalculation: {
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
  };
  grossValue: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  additionalInfo?: {
    invoiceTerms: string;
    bankDetails: string;
  };
};

const getInitialData = (): InvoiceData => ({
  invoiceNumber: "",
  date: "",
  companySettingsId: "",
  billingAddress: {
    name: "",
    address: "",
    email: "",
    contactNumber: "",
    gstNumber: "",
    isInsideBangalore: true,
    paidBy: "",
    splitPaymentDetails: "",
  },
  invoiceDetails: {
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0]!,
  },
  warrantyType: "brand",
  warrantyMonths: null,
  saleType: "direct",
  items: [
    {
      id: Date.now().toString(),
      inventoryProductId: undefined,
      product: "",
      serialNumber: "",
      hsnSac: "",
      qty: 1,
      uom: "Nos",
      rate: 0,
      total: 0,
      discount: 0,
      gstAmount: 0,
      gross: 0,
      cgstPercent: 0,
      cgstAmount: 0,
      sgstPercent: 0,
      sgstAmount: 0,
      igstPercent: 0,
      igstAmount: 0,
      sortOrder: 0,
    },
  ],
  exchangeItems: [],
  exchangeValue: 0,
  gstCalculation: { cgst: 0, sgst: 0, igst: 0, total: 0 },
  grossValue: 0,
  taxAmount: 0,
  totalAmount: 0,
  amountPaid: 0,
  additionalInfo: {
    invoiceTerms: "",
    bankDetails: "",
  },
});

export default function CreateInvoicePage() {
  const [view, setView] = useState<InvoiceView>("both");
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(getInitialData());
  const [debouncedData] = useDebounce(invoiceData, 800);
  const [selectedSettingsId, setSelectedSettingsId] = useState<string>("");

  const { data: settingsData, loading: settingsLoading } =
    useQuery<GetAllInvoiceSettingsResponse>(GET_ALL_INVOICE_SETTINGS, {
      fetchPolicy: "cache-and-network",
    });

  const { data: invoiceNumberData } = useQuery<{
    getNextInvoiceNumber: string;
  }>(GET_NEXT_INVOICE_NUMBER);

  const allSettings = settingsData?.getInvoiceSettings ?? [];
  const applySettings = (settings: InvoiceCompanySettings) => {
    setInvoiceData((prev) => ({
      ...prev,
      companySettingsId: settings.id,
      additionalInfo: {
        invoiceTerms: settings.defaultInvoiceTermsBrand, // ← this sets brand terms
        bankDetails: settings.defaultBankDetails, // ← this sets bank details
      },
    }));
  };

  useEffect(() => {
    if (allSettings.length === 0) return;
    if (selectedSettingsId) return;
    const defaultSettings =
      allSettings.find((s) => s.isDefault) ?? allSettings[0];
    if (defaultSettings) {
      setSelectedSettingsId(defaultSettings.id);
      applySettings(defaultSettings);
    }
  }, [allSettings]);

  useEffect(() => {
    if (!invoiceNumberData?.getNextInvoiceNumber) return;
    setInvoiceData((prev) => ({
      ...prev,
      invoiceDetails: {
        ...prev.invoiceDetails,
        invoiceNumber: invoiceNumberData.getNextInvoiceNumber,
      },
    }));
  }, [invoiceNumberData]);

  const handleReset = () => {
    const currentSettings = allSettings.find(
      (s) => s.id === selectedSettingsId,
    );
    setInvoiceData({
      ...getInitialData(),
      companySettingsId: selectedSettingsId,
      additionalInfo: {
        invoiceTerms: currentSettings?.defaultInvoiceTermsBrand ?? "",
        bankDetails: currentSettings?.defaultBankDetails ?? "",
      },
    });
    // invoice number will auto-update via refetchQueries
  };

  const handleSettingsChange = (id: string) => {
    setSelectedSettingsId(id);
    const selected = allSettings.find((s) => s.id === id);
    if (selected) applySettings(selected);
  };

  if (settingsLoading && allSettings.length === 0) {
    return <InvoiceCreatePageSkeleton />;
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <PageHeader
        title="Create Invoice"
        breadcrumbs={[
          { label: "Inventory" },
          { label: "All Invoices", href: "/inventory/invoices" },
          { label: "Create Invoice" },
        ]}
      />

      {/* ── Settings Selector ── */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Company Settings
        </span>
        {settingsLoading ? (
          <div className="w-5 h-5 border-2 border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
        ) : allSettings.length === 0 ? (
          <span className="text-sm text-red-500">
            No settings found. Please{" "}
            <a
              href="/inventory/settings/create"
              className="underline text-[rgb(33,76,123)]"
            >
              create settings
            </a>{" "}
            first.
          </span>
        ) : (
          <select
            title="company settings"
            value={selectedSettingsId}
            onChange={(e) => handleSettingsChange(e.target.value)}
            className="flex-1 h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(33,76,123)] max-w-xs"
          >
            {allSettings.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} {s.isDefault ? "(Default)" : ""}
              </option>
            ))}
          </select>
        )}
        {selectedSettingsId && allSettings.length > 0 && (
          <span className="text-xs text-gray-400">
            GSTIN: {allSettings.find((s) => s.id === selectedSettingsId)?.gstin}
          </span>
        )}
      </div>

      <InvoiceTopBar
        view={view}
        onViewChange={setView}
        invoiceData={invoiceData}
        selectedSettings={allSettings.find((s) => s.id === selectedSettingsId)}
        onReset={handleReset}
      />

      <InvoiceLayout view={view}>
        <InvoiceForm
          data={invoiceData}
          onChange={setInvoiceData}
          selectedSettings={allSettings.find(
            (s) => s.id === selectedSettingsId,
          )}
        />
        <InvoicePreviewWrapper
          data={debouncedData}
          selectedSettings={allSettings.find(
            (s) => s.id === selectedSettingsId,
          )}
        />
      </InvoiceLayout>
    </div>
  );
}
