"use client";
import { Input, Label } from "@repo/ui";
import { CreateInvoiceSettingsInput } from "@repo/validations";

interface Props {
  data: CreateInvoiceSettingsInput;
  onChange: (data: CreateInvoiceSettingsInput) => void;
}

export function CompanyInfoForm({ data, onChange }: Props) {
  const update = (
    key: keyof CreateInvoiceSettingsInput,
    value: string | boolean,
  ) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label">Settings Label</Label>
        <Input
          id="label"
          placeholder="e.g. HelloFi Bangalore Main"
          value={data.label}
          onChange={(e) => update("label", e.target.value)}
        />
        <p className="text-xs text-gray-400">
          A name to identify this settings profile
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            placeholder="HelloFi Recommerce"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Full address"
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            placeholder="8150835583"
            value={data.contact}
            onChange={(e) => update("contact", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@hellofi.in"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="gstin">GSTIN</Label>
          <Input
            id="gstin"
            placeholder="29AAQFH3388A1Z4"
            value={data.gstin}
            onChange={(e) => update("gstin", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            placeholder="https://s3.amazonaws.com/..."
            value={data.logoUrl ?? ""}
            onChange={(e) => update("logoUrl", e.target.value)}
          />
          <p className="text-xs text-gray-400">PNG/JPG only — used in PDF</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stampUrl">Stamp URL</Label>
          <Input
            id="stampUrl"
            placeholder="https://s3.amazonaws.com/..."
            value={data.stampUrl ?? ""}
            onChange={(e) => update("stampUrl", e.target.value)}
          />
          <p className="text-xs text-gray-400">PNG/JPG only — used in PDF</p>
        </div>
      </div>

      {/* Default Toggle */}
      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <input
          id="isDefault"
          type="checkbox"
          checked={data.isDefault ?? false}
          onChange={(e) => update("isDefault", e.target.checked)}
          className="w-4 h-4 accent-[rgb(33,76,123)]"
        />
        <div>
          <label
            htmlFor="isDefault"
            className="text-sm font-medium text-gray-800 cursor-pointer"
          >
            Set as Default
          </label>
          <p className="text-xs text-gray-500">
            Auto-selected when creating new invoices
          </p>
        </div>
      </div>
    </div>
  );
}
