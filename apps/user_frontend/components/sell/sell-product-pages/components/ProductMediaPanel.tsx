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
      {/* Sold badge — full-width pill, left-aligned icon + text */}
      <div className="mt-6">
        <span className="flex w-full items-center gap-2 rounded-xl border border-[#0066FF] bg-[#F0F7FF] px-4 py-3 text-sm text-[#0066FF] font-semibold">
          <Users size={18} className="text-[#0066FF] flex-shrink-0" />
          {soldBadgeText}
        </span>
      </div>

      {/* Trust list — vertical stack, left-aligned, light gray icon circles */}
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-full bg-gray-100">
            <ShieldCheck size={20} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-tight">
              100% Safe
            </p>
            <p className="text-sm text-gray-400 leading-tight">
              Secure data wipes guaranteed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-full bg-gray-100">
            <BadgeDollarSign size={20} className="text-[#0066FF]" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-tight">
              Best Prices
            </p>
            <p className="text-sm text-gray-400 leading-tight">
              Algorithmic valuation engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 flex-shrink-0 rounded-full bg-gray-100">
            <Zap size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-tight">
              Quick Payment
            </p>
            <p className="text-sm text-gray-400 leading-tight">
              Instant bank transfer on pickup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
