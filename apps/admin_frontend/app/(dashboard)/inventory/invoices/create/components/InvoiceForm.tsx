"use client";
import { InvoiceData } from "../page";
import { useState } from "react";
import { InvoiceDetailsSection } from "./form/InvoiceDetailsSection";
import { CompanyDetailsSection } from "./form/CompanyDetailsSection";
import { ClientDetailsSection } from "./form/ClientDetailsSection";
import { InvoiceItemsSection } from "./form/InvoiceItemsSection";
import { AdditionalInfoSection } from "./form/AdditionalInfoSection";
import { InvoiceCompanySettings } from "../../../settings/types";

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  selectedSettings?: InvoiceCompanySettings;
}

export function InvoiceForm({
  data,
  onChange,
  selectedSettings,
}: InvoiceFormProps) {
  const [expanded, setExpanded] = useState({
    companyDetails: true,
    clientDetails: false,
    invoiceDetails: false,
    invoiceItems: false,
    additionalInfo: false, // ← add this
  });

  const toggle = (key: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl border border-gray-200 p-4">
      <h2 className="text-base font-semibold text-gray-900">Create Invoice</h2>
      <CompanyDetailsSection
        selectedSettings={selectedSettings}
        isExpanded={expanded.companyDetails}
        onToggle={() => toggle("companyDetails")}
      />
      <ClientDetailsSection
        data={data}
        onChange={onChange}
        isExpanded={expanded.clientDetails}
        onToggle={() => toggle("clientDetails")}
      />
      <InvoiceDetailsSection
        data={data}
        onChange={onChange}
        isExpanded={expanded.invoiceDetails}
        onToggle={() => toggle("invoiceDetails")}
      />
      <InvoiceItemsSection
        data={data}
        onChange={onChange}
        isExpanded={expanded.invoiceItems}
        onToggle={() => toggle("invoiceItems")}
      />

      <AdditionalInfoSection
        data={data}
        onChange={onChange}
        isExpanded={expanded.additionalInfo}
        onToggle={() => toggle("additionalInfo")}
        selectedSettings={selectedSettings}
      />
    </div>
  );
}
