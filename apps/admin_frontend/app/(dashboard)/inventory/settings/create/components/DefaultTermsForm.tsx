"use client";
import { Label } from "@repo/ui";

export interface DefaultTerms {
  defaultInvoiceTermsBrand: string;
  defaultInvoiceTermsHellofi: string;
  defaultInvoiceTermsNone: string;
}

interface Props {
  data: DefaultTerms;
  onChange: (data: DefaultTerms) => void;
}

const TEXTAREA_CLASS =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(33,76,123)] resize-none leading-relaxed";

export function DefaultTermsForm({ data, onChange }: Props) {
  const update = (key: keyof DefaultTerms, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          For HelloFi Warranty terms, use{" "}
          <code className="bg-blue-100 px-1 rounded">{"{months}"}</code> as a
          placeholder — it will be replaced with the selected month number
          during invoice creation.
        </p>
      </div>

      {/* Brand Warranty Terms */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brand-terms">Brand Warranty Terms</Label>
        <textarea
          id="brand-terms"
          rows={6}
          value={data.defaultInvoiceTermsBrand}
          onChange={(e) => update("defaultInvoiceTermsBrand", e.target.value)}
          placeholder="• GST is calculated on the marginal value.&#10;• Device is sold with Brand Warranty..."
          className={TEXTAREA_CLASS}
        />
      </div>

      {/* HelloFi Warranty Terms */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="hellofi-terms">HelloFi Warranty Terms</Label>
        <textarea
          id="hellofi-terms"
          rows={6}
          value={data.defaultInvoiceTermsHellofi}
          onChange={(e) => update("defaultInvoiceTermsHellofi", e.target.value)}
          placeholder="• GST is calculated on the marginal value.&#10;• {months} Month seller service warranty..."
          className={TEXTAREA_CLASS}
        />
        <p className="text-xs text-gray-400">
          Use {"{months}"} where the month count should appear
        </p>
      </div>

      {/* No Warranty Terms */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="none-terms">No Warranty Terms</Label>
        <textarea
          id="none-terms"
          rows={5}
          value={data.defaultInvoiceTermsNone}
          onChange={(e) => update("defaultInvoiceTermsNone", e.target.value)}
          placeholder="• GST is calculated on the marginal value.&#10;• We accept BuyBack only..."
          className={TEXTAREA_CLASS}
        />
      </div>
    </div>
  );
}
