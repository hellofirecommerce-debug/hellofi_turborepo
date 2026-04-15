"use client";
import { InvoiceData } from "../../page";
import { Accordion } from "@repo/ui";
import { FormField } from "./FormField";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function InvoiceDetailsSection({
  data,
  onChange,
  isExpanded,
  onToggle,
}: Props) {
  const update = (key: keyof InvoiceData["invoiceDetails"], value: string) => {
    onChange({
      ...data,
      invoiceDetails: { ...data.invoiceDetails, [key]: value },
    });
  };

  return (
    <Accordion
      title="Invoice Details"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          label="Invoice Number"
          value={data.invoiceDetails.invoiceNumber}
          onChange={(v) => update("invoiceNumber", v)}
          placeholder="HFI-000001/25-26"
          readOnly
        />
        <FormField
          label="Invoice Date"
          value={data.invoiceDetails.invoiceDate}
          onChange={(v) => update("invoiceDate", v)}
          type="date"
        />
      </div>
    </Accordion>
  );
}
