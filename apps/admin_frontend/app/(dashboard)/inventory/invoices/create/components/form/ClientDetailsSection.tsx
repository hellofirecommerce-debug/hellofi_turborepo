"use client";
import { InvoiceData } from "../../page";
import { Accordion } from "@repo/ui";
import { FormField } from "./FormField";
import { Label } from "@repo/ui";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ClientDetailsSection({
  data,
  onChange,
  isExpanded,
  onToggle,
}: Props) {
  const update = (
    key: keyof InvoiceData["billingAddress"],
    value: string | boolean,
  ) => {
    onChange({
      ...data,
      billingAddress: { ...data.billingAddress, [key]: value },
    });
  };

  return (
    <Accordion
      title="Client Details"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          label="Client Name"
          value={data.billingAddress.name}
          onChange={(v) => update("name", v)}
          placeholder="Rahul Sharma"
        />
        <FormField
          label="Contact Number"
          value={data.billingAddress.contactNumber}
          onChange={(v) => update("contactNumber", v)}
          placeholder="+91 91234 56789"
        />
        <FormField
          label="Email"
          value={data.billingAddress.email}
          onChange={(v) => update("email", v)}
          placeholder="client@email.com"
        />
        <FormField
          label="GSTIN (optional)"
          value={data.billingAddress.gstNumber}
          onChange={(v) => update("gstNumber", v)}
          placeholder="GST Number"
        />
        <FormField
          label="Address"
          value={data.billingAddress.address}
          onChange={(v) => update("address", v)}
          placeholder="Full address"
          colSpan
        />
        <FormField
          label="Paid By"
          value={data.billingAddress.paidBy}
          onChange={(v) => update("paidBy", v)}
          placeholder="Bank Transfer / Cash / UPI"
        />
        <div className="flex flex-col gap-1.5">
          <Label>Location</Label>
          <select
            title="isinsidebangalore"
            value={data.billingAddress.isInsideBangalore ? "inside" : "outside"}
            onChange={(e) =>
              update("isInsideBangalore", e.target.value === "inside")
            }
            className="h-9 w-full rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(33,76,123)]"
          >
            <option value="inside">Inside Bangalore (CGST + SGST)</option>
            <option value="outside">Outside Bangalore (IGST)</option>
          </select>
        </div>
      </div>
    </Accordion>
  );
}
