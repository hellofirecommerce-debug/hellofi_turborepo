"use client";
import { Label } from "@repo/ui";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function BankDetailsForm({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="bank-details">Default Bank Details</Label>
      <textarea
        id="bank-details"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="• Bank: ICICI Bank&#10;• Account: 100805003848&#10;• IFSC: ICIC0001008&#10;• Branch: BANGALORE, KORAMANGALA"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(33,76,123)] resize-none leading-relaxed"
      />
      <p className="text-xs text-gray-400">
        Each point on a new line. Use • at the start for bullet points.
      </p>
    </div>
  );
}
