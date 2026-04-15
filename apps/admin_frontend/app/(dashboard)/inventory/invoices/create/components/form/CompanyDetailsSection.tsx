"use client";
import { InvoiceCompanySettings } from "../../../../settings/types";
import { Accordion, Input, Label } from "@repo/ui";

interface Props {
  selectedSettings?: InvoiceCompanySettings;
  isExpanded: boolean;
  onToggle: () => void;
}

export function CompanyDetailsSection({
  selectedSettings,
  isExpanded,
  onToggle,
}: Props) {
  return (
    <Accordion
      title="Company Details"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {!selectedSettings ? (
        <p className="text-sm text-gray-400">
          Select company settings above to view details.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Company Name</Label>
            <Input
              value={selectedSettings.name}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input
              value={selectedSettings.address}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Contact</Label>
            <Input
              value={selectedSettings.contact}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input
              value={selectedSettings.email}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>GSTIN</Label>
            <Input
              value={selectedSettings.gstin}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-400 sm:col-span-2">
            To change company details,{" "}
            <a
              href="/inventory/settings"
              className="underline text-[rgb(33,76,123)]"
            >
              update settings
            </a>
            .
          </p>
        </div>
      )}
    </Accordion>
  );
}
