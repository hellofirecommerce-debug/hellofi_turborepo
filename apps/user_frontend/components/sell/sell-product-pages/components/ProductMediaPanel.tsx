// components/sell/sell-product-pages/components/ProductMediaPanel.tsx
import Image from "next/image";
import { Users, ShieldCheck, BadgeDollarSign, Zap } from "lucide-react";

interface Props {
  image: string;
  alt: string;
  soldBadgeText?: string;
}

export function ProductMediaPanel({
  image,
  alt,
  soldBadgeText = "8+ sold in last 30 days",
}: Props) {
  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-100 bg-transparent p-4 sm:p-6 flex justify-center">
        <div className="flex flex-col items-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${image}`}
            alt={alt}
            width={320}
            height={420}
            className="h-[220px] sm:h-[320px] md:h-[380px] w-auto object-contain"
            sizes="(max-width: 640px) 90vw, 400px"
            priority
          />
        </div>
      </div>

      {/* Sold badge — centered, blue outline pill */}
      <div className="mt-6 flex items-center justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0066FF] bg-[#F0F7FF] px-4 py-2 text-xs sm:text-sm text-[#0066FF] font-semibold shadow-sm">
          <Users size={14} className="text-[#0066FF]" />
          {soldBadgeText}
        </span>
      </div>

      {/* Trust list — centered, icon-chip style */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-50">
            <ShieldCheck size={20} className="text-emerald-500" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
            100% Safe
          </p>
          <p className="hidden sm:block text-xs text-gray-500 leading-tight">
            Secure data wipes guaranteed
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-50">
            <BadgeDollarSign size={20} className="text-[#0066FF]" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
            Best Prices
          </p>
          <p className="hidden sm:block text-xs text-gray-500 leading-tight">
            Algorithmic valuation engine
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-50">
            <Zap size={20} className="text-amber-400" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
            Quick Payment
          </p>
          <p className="hidden sm:block text-xs text-gray-500 leading-tight">
            Instant bank transfer on pickup
          </p>
        </div>
      </div>
    </div>
  );
}
