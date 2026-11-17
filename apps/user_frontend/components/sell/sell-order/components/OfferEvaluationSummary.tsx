import { Smartphone } from "lucide-react";
import type { OfferOrder } from "../types";

export function OfferEvaluationSummary({ order }: { order: OfferOrder }) {
  const device = [
    [order.brandName, order.productName].filter(Boolean).join(" "),
    order.variantName,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="self-start rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="border-b border-gray-100 pb-3 text-sm font-bold text-gray-900">
        Evaluation Summary
      </h3>

      <div className="mt-3 flex items-start justify-between gap-4">
        <span className="flex shrink-0 items-center gap-2 text-xs text-gray-500">
          <Smartphone size={14} className="text-[#0066FF]" />
          Device
        </span>
        <span className="text-right text-xs font-semibold text-gray-900">
          {device}
        </span>
      </div>
    </section>
  );
}
