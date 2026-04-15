"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { InvoiceTopBar } from "../../create/components/InvoiceTopBar";
import { InvoiceLayout } from "../../create/components/InvoiceLayout";
import { InvoiceForm } from "../../create/components/InvoiceForm";
import { InvoicePreviewWrapper } from "../../create/components/InvoicePreviewWrapper";
import { GET_ALL_INVOICE_SETTINGS } from "../../../../../../lib/graphql/queries/invoiceSettings.queries";
import { GET_INVOICE_BY_ID } from "../../../../../../lib/graphql/queries/invoice.queries";
import { UPDATE_INVOICE } from "../../../../../../lib/graphql/mutations/invoice.mutations";
import {
  GetAllInvoiceSettingsResponse,
  InvoiceCompanySettings,
} from "../../../settings/types";
import { InvoiceCreatePageSkeleton } from "../../components/InvoiceCreatePageSkeleton";
import { GetInvoiceByIdResponse } from "../../types";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { InvoiceData } from "../../create/page";

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [view, setView] = useState<"form" | "both" | "preview">("both");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [debouncedData] = useDebounce(invoiceData, 800);
  const [selectedSettingsId, setSelectedSettingsId] = useState<string>("");

  const { data: settingsData, loading: settingsLoading } =
    useQuery<GetAllInvoiceSettingsResponse>(GET_ALL_INVOICE_SETTINGS, {
      fetchPolicy: "cache-and-network",
    });

  const { data: invoiceResult, loading: invoiceLoading } =
    useQuery<GetInvoiceByIdResponse>(GET_INVOICE_BY_ID, {
      variables: { id },
      fetchPolicy: "cache-and-network",
    });

  const allSettings = settingsData?.getInvoiceSettings ?? [];

  // ── Pre-fill form from existing invoice ──
  useEffect(() => {
    const invoice = invoiceResult?.getInvoiceById;
    if (!invoice) return;

    setSelectedSettingsId(invoice.companySettingsId);

    setInvoiceData({
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.invoiceDate,
      companySettingsId: invoice.companySettingsId,
      billingAddress: {
        name: invoice.clientName,
        address: invoice.clientAddress,
        email: invoice.clientEmail,
        contactNumber: invoice.clientContact,
        gstNumber: invoice.clientGstin ?? "",
        isInsideBangalore: invoice.isInsideBangalore,
        paidBy: invoice.paidBy ?? "",
      },
      invoiceDetails: {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: new Date(invoice.invoiceDate).toISOString().split("T")[0]!,
      },
      warrantyType: invoice.warrantyType.toLowerCase() as
        | "brand"
        | "hellofi"
        | "none",
      warrantyMonths: invoice.warrantyMonths ?? null,
      saleType: invoice.saleType.toLowerCase() as "direct" | "exchange",
      items: invoice.items.map((item) => ({
        id: item.id,
        product: item.product,
        serialNumber: item.serialNumber ?? "",
        hsnSac: item.hsnSac ?? "",
        qty: item.qty,
        uom: item.uom,
        rate: item.rate,
        total: item.total,
        discount: item.discount,
        gstAmount: item.gstAmount,
        gross: item.gross,
      })),
      exchangeItems: invoice.exchangeItems.map((ex) => ({
        id: ex.id,
        productName: ex.productName,
        serialNumber: ex.serialNumber ?? "",
      })),
      exchangeValue: invoice.exchangeValue,
      gstCalculation: {
        cgst: invoice.cgst,
        sgst: invoice.sgst,
        igst: invoice.igst,
        total: invoice.taxAmount,
      },
      grossValue: invoice.grossValue,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      amountPaid: invoice.amountPaid,
      additionalInfo: {
        invoiceTerms: invoice.customInvoiceTerms ?? "",
        bankDetails: invoice.customBankDetails ?? "",
      },
    });
  }, [invoiceResult]);

  const handleSettingsChange = (id: string) => {
    setSelectedSettingsId(id);
    const selected = allSettings.find((s) => s.id === id);
    if (!selected || !invoiceData) return;
    setInvoiceData((prev) => ({
      ...prev!,
      companySettingsId: selected.id,
      additionalInfo: {
        invoiceTerms: selected.defaultInvoiceTermsBrand,
        bankDetails: selected.defaultBankDetails,
      },
    }));
  };

  if (invoiceLoading || !invoiceData) {
    return <InvoiceCreatePageSkeleton />;
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <PageHeader
        title="Edit Invoice"
        breadcrumbs={[
          { label: "Inventory" },
          { label: "All Invoices", href: "/inventory/invoices" },
          { label: "Edit Invoice" },
        ]}
      />

      {/* ── Settings Selector ── */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Company Settings
        </span>
        {settingsLoading ? (
          <div className="w-5 h-5 border-2 border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
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
        onReset={() => router.push("/inventory/invoices")}
        isEdit
        editId={id}
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
          data={debouncedData!}
          selectedSettings={allSettings.find(
            (s) => s.id === selectedSettingsId,
          )}
        />
      </InvoiceLayout>
    </div>
  );
}
