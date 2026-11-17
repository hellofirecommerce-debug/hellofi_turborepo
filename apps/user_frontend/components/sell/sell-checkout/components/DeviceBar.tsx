import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";
import type { CheckoutOrder } from "../types";

export default function DeviceBar({ order }: { order: CheckoutOrder }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-[#F4F7FF] px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-white text-[#0066FF]">
        <Smartphone size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-gray-900">
          {[order.brandName, order.productName].filter(Boolean).join(" ")}
        </p>
        {order.variantName && (
          <p className="truncate text-xs text-gray-500">{order.variantName}</p>
        )}
      </div>

      <Link
        href="/sell"
        className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#0066FF]"
      >
        Change <ArrowRight size={13} />
      </Link>
    </div>
  );
}
