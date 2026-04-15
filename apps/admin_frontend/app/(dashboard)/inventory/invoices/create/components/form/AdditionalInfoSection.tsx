"use client";
import { InvoiceData } from "../../page";
import { Label, Accordion } from "@repo/ui";
import { InvoiceCompanySettings } from "../../../../settings/types";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  isExpanded: boolean;
  onToggle: () => void;
  selectedSettings?: InvoiceCompanySettings;
}

type WarrantyType = "hellofi" | "brand" | "none";

const WARRANTY_MONTHS = [1, 2, 3, 4, 5, 6];

export function AdditionalInfoSection({
  data,
  onChange,
  isExpanded,
  onToggle,
  selectedSettings,
}: Props) {
  const warrantyType = (data.warrantyType ?? "brand") as WarrantyType;
  const warrantyMonths = data.warrantyMonths ?? 3;

  // ── Always use settings ──
  const getTermsForType = (type: WarrantyType, months: number): string => {
    if (!selectedSettings) return "";
    if (type === "hellofi") {
      return selectedSettings.defaultInvoiceTermsHellofi.replace(
        "{months}",
        String(months),
      );
    }
    if (type === "brand") return selectedSettings.defaultInvoiceTermsBrand;
    return selectedSettings.defaultInvoiceTermsNone;
  };

  const additionalInfo = data.additionalInfo ?? {
    invoiceTerms: getTermsForType(warrantyType, warrantyMonths),
    bankDetails: selectedSettings?.defaultBankDetails ?? "",
  };

  const handleWarrantyTypeChange = (type: WarrantyType) => {
    const months = type === "hellofi" ? warrantyMonths : null;
    const newTerms = getTermsForType(type, months ?? 3);
    onChange({
      ...data,
      warrantyType: type,
      warrantyMonths: months,
      additionalInfo: { ...additionalInfo, invoiceTerms: newTerms },
    });
  };

  const handleMonthsChange = (months: number) => {
    const newTerms = getTermsForType(warrantyType, months);
    onChange({
      ...data,
      warrantyMonths: months,
      additionalInfo: { ...additionalInfo, invoiceTerms: newTerms },
    });
  };

  return (
    <Accordion
      title="Additional Information"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-4">
        {/* ── Warranty Type ── */}
        <div className="flex flex-col gap-2">
          <Label>Warranty Type</Label>
          <div className="flex gap-2">
            {(
              [
                { value: "brand", label: "Brand Warranty" },
                { value: "hellofi", label: "HelloFi Warranty" },
                { value: "none", label: "No Warranty" },
              ] as { value: WarrantyType; label: string }[]
            ).map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleWarrantyTypeChange(opt.value)}
                className={`flex-1 flex items-center justify-center py-2 rounded-lg text-xs font-medium border-2 cursor-pointer transition-all ${
                  warrantyType === opt.value
                    ? "border-[rgb(33,76,123)] bg-[rgb(33,76,123)] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Months selector ── */}
        {warrantyType === "hellofi" && (
          <div className="flex flex-col gap-2">
            <Label>Warranty Duration (Months)</Label>
            <div className="flex gap-2 flex-wrap">
              {WARRANTY_MONTHS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMonthsChange(m)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold border-2 transition-all ${
                    warrantyMonths === m
                      ? "border-[rgb(33,76,123)] bg-[rgb(33,76,123)] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Selected: {warrantyMonths} month{warrantyMonths > 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* ── Invoice Terms ── */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invoice-terms">Invoice Terms</Label>
          <textarea
            id="invoice-terms"
            rows={7}
            value={
              additionalInfo.invoiceTerms ||
              getTermsForType(warrantyType, warrantyMonths)
            }
            onChange={(e) =>
              onChange({
                ...data,
                additionalInfo: {
                  ...additionalInfo,
                  invoiceTerms: e.target.value,
                },
              })
            }
            placeholder="Enter invoice terms"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(33,76,123)] resize-none leading-relaxed"
          />
          <p className="text-xs text-gray-400">
            Auto-filled from settings. You can edit or add more points.
          </p>
        </div>

        {/* ── Bank Details ── */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bank-details">Bank Details</Label>
          <textarea
            id="bank-details"
            rows={5}
            value={additionalInfo.bankDetails}
            onChange={(e) =>
              onChange({
                ...data,
                additionalInfo: {
                  ...additionalInfo,
                  bankDetails: e.target.value,
                },
              })
            }
            placeholder={selectedSettings?.defaultBankDetails ?? ""}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(33,76,123)] resize-none leading-relaxed"
          />
          <p className="text-xs text-gray-400">
            Each point on a new line. Use • at the start for bullet points.
          </p>
        </div>
      </div>
    </Accordion>
  );
}
