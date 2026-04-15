"use client";
import { Download, FileText, Eye, Columns2 } from "lucide-react";
import { Button } from "@repo/ui";
import { InvoiceView, InvoiceData } from "../page";
import { pdf } from "@react-pdf/renderer";
import { InvoiceDocument } from "./InvoiceDocument";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_INVOICE,
  UPDATE_INVOICE,
} from "../../../../../../lib/graphql/mutations/invoice.mutations";
import { toast } from "sonner";
import { useState } from "react";
import { InvoiceType } from "../types";
import { InvoiceCompanySettings } from "../../../settings/types";

interface InvoiceTopBarProps {
  view: InvoiceView;
  onViewChange: (view: InvoiceView) => void;
  invoiceData: InvoiceData;
  selectedSettings?: InvoiceCompanySettings;
  onReset: () => void;
  isEdit?: boolean; // ← add
  editId?: string; // ← add
}

const viewOptions: {
  value: InvoiceView;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "form", label: "Form", icon: <FileText size={15} /> },
  { value: "both", label: "Both", icon: <Columns2 size={15} /> },
  { value: "preview", label: "Preview", icon: <Eye size={15} /> },
];

export function InvoiceTopBar({
  view,
  onViewChange,
  invoiceData,
  selectedSettings,
  onReset,
  isEdit,
  editId,
}: InvoiceTopBarProps) {
  const [isSaving, setIsSaving] = useState(false);

  const [createInvoice] = useMutation<{ createInvoice: InvoiceType }>(
    CREATE_INVOICE,
    {
      refetchQueries: ["GetNextInvoiceNumber"], // ← refetch counter
      onCompleted: (data) => {
        toast.success(
          `Invoice ${data.createInvoice.invoiceNumber} saved successfully`,
        );
        onReset(); // ← reset form
      },
    },
  );

  const [updateInvoice] = useMutation<{ updateInvoice: InvoiceType }>(
    UPDATE_INVOICE,
    {
      onCompleted: (data) => {
        toast.success(
          `Invoice ${data.updateInvoice.invoiceNumber} updated successfully`,
        );
        onReset();
      },
      onError: (err) => toast.error(err.message),
    },
  );

  const handleSaveAndDownload = async () => {
    setIsSaving(true);

    const blob = await pdf(
      <InvoiceDocument
        data={invoiceData}
        selectedSettings={selectedSettings}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceData.invoiceDetails.invoiceNumber || "Invoice-draft"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    const inBLR = invoiceData.billingAddress.isInsideBangalore;

    const input = {
      ...(isEdit && editId ? { id: editId } : {}),
      invoiceNumber: invoiceData.invoiceDetails.invoiceNumber,
      invoiceDate: invoiceData.invoiceDetails.invoiceDate,
      companySettingsId: invoiceData.companySettingsId,
      clientName: invoiceData.billingAddress.name,
      clientAddress: invoiceData.billingAddress.address,
      clientEmail: invoiceData.billingAddress.email,
      clientContact: invoiceData.billingAddress.contactNumber,
      clientGstin: invoiceData.billingAddress.gstNumber || undefined,
      isInsideBangalore: inBLR,
      paidBy: invoiceData.billingAddress.paidBy,
      saleType: invoiceData.saleType.toUpperCase(),
      warrantyType: invoiceData.warrantyType.toUpperCase(),
      warrantyMonths: invoiceData.warrantyMonths ?? undefined,
      grossValue: invoiceData.grossValue,
      taxAmount: invoiceData.taxAmount,
      totalAmount: invoiceData.totalAmount,
      exchangeValue: invoiceData.exchangeValue,
      amountPaid: invoiceData.amountPaid,
      cgst: invoiceData.gstCalculation.cgst,
      sgst: invoiceData.gstCalculation.sgst,
      igst: invoiceData.gstCalculation.igst,
      invoiceTerms: invoiceData.additionalInfo?.invoiceTerms ?? "",
      bankDetails: invoiceData.additionalInfo?.bankDetails ?? "",
      items: invoiceData.items.map((item, index) => ({
        product: item.product,
        serialNumber: item.serialNumber || undefined,
        hsnSac: item.hsnSac || undefined,
        qty: item.qty,
        uom: item.uom,
        rate: item.rate,
        total: item.total,
        discount: item.discount,
        gross: item.gross,
        gstAmount: item.gstAmount,
        cgstPercent: inBLR ? 9 : 0,
        cgstAmount: inBLR ? item.gstAmount / 2 : 0,
        sgstPercent: inBLR ? 9 : 0,
        sgstAmount: inBLR ? item.gstAmount / 2 : 0,
        igstPercent: !inBLR ? 18 : 0,
        igstAmount: !inBLR ? item.gstAmount : 0,
        sortOrder: index,
      })),
      exchangeItems: invoiceData.exchangeItems.map((ex) => ({
        productName: ex.productName,
        serialNumber: ex.serialNumber || undefined,
      })),
    };

    if (isEdit && editId) {
      await updateInvoice({ variables: { input } });
    } else {
      await createInvoice({ variables: { input } });
    }

    setIsSaving(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {viewOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onViewChange(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === opt.value
                ? "bg-white text-[rgb(33,76,123)] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>

      <Button
        size="md"
        onClick={handleSaveAndDownload}
        disabled={isSaving}
        className="gap-2"
      >
        <Download size={15} />
        {isSaving
          ? isEdit
            ? "Updating..."
            : "Saving..."
          : isEdit
            ? "Update & Download"
            : "Save & Download"}
      </Button>
    </div>
  );
}
