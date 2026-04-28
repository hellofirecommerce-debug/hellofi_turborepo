"use client";
import { InvoiceData } from "../../page";
import { Accordion, Label } from "@repo/ui";
import { FormField } from "./FormField";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

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

        {/* ── Payment Mode ── */}
        <div className="flex flex-col gap-1.5">
          <Label>Payment Mode</Label>
          <select
            title="payment mode"
            value={data.billingAddress.paidBy}
            onChange={(e) => update("paidBy", e.target.value)}
            className={selectClass}
          >
            <option value="">Select payment mode</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="SPLIT_PAYMENT">Split Payment</option>
            <option value="RAZORPAY">Razorpay</option>
          </select>
        </div>

        {/* ── Split Payment Details — only if SPLIT_PAYMENT ── */}
        {data.billingAddress.paidBy === "SPLIT_PAYMENT" && (
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Split Payment Details</Label>
            <input
              placeholder="e.g. 20000 cash + 30000 UPI"
              value={data.billingAddress.splitPaymentDetails}
              onChange={(e) => update("splitPaymentDetails", e.target.value)}
              className={selectClass}
            />
          </div>
        )}

        {/* ── Location ── */}
        <div className="flex flex-col gap-1.5">
          <Label>Location</Label>
          <select
            title="isinsidebangalore"
            value={data.billingAddress.isInsideBangalore ? "inside" : "outside"}
            onChange={(e) =>
              update("isInsideBangalore", e.target.value === "inside")
            }
            className={selectClass}
          >
            <option value="inside">Inside Bangalore (CGST + SGST)</option>
            <option value="outside">Outside Bangalore (IGST)</option>
          </select>
        </div>
      </div>
    </Accordion>
  );
}
