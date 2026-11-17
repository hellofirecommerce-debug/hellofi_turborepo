import { Lock } from "lucide-react";

export function OfferPriceCard({ price }: { price: number }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#3B82F6] bg-white px-6 py-7 text-center shadow-sm">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-[#E8F8F1]"
      />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600">
          <Lock size={12} />
          Best Price on HelloFi
        </span>

        <p className="mt-3 text-4xl font-extrabold tracking-tight text-[#0066FF] sm:text-5xl">
          ₹ {price.toLocaleString("en-IN")}
        </p>

        <p className="mt-3 text-[11px] font-semibold text-gray-600">
          Price Valid for now only! It will Change Later
        </p>
      </div>
    </div>
  );
}
