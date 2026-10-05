// components/sell/sell-product-pages/components/ProductMediaPanel.tsx
import Image from "next/image";
import { Users, ShieldCheck, BadgeDollarSign, Zap, Truck } from "lucide-react";

interface Props {
  image: string;
  alt: string;
  productName: string;
  soldBadgeText?: string;
}

export function ProductMediaPanel({
  image,
  alt,
  productName,
  soldBadgeText = "8+ sold this Week",
}: Props) {
  const imageSrc = `${process.env.NEXT_PUBLIC_CDN_URL}/${image}`;

  return (
    <div className="w-full">
      {/* ───────── Mobile: compact card (image + name + badge + 2x2 trust grid) ───────── */}
      <div className="sm:hidden sm:rounded-0  bg-white  p-0 sm:p-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-24 h-28 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={alt}
              width={160}
              height={200}
              className="h-full w-full object-contain"
              sizes="96px"
              priority
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-gray-900 leading-snug">
              Sell {productName}
            </h1>

            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#F0F7FF] px-2.5 py-1 text-[11px] font-semibold text-[#0066FF]">
              <Users size={12} className="flex-shrink-0" />
              {soldBadgeText}
            </span>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck
                  size={14}
                  className="text-emerald-500 flex-shrink-0"
                />
                <span className="text-xs text-gray-600">100% Safe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BadgeDollarSign
                  size={14}
                  className="text-[#0066FF] flex-shrink-0"
                />
                <span className="text-xs text-gray-600">Best Prices</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400 flex-shrink-0" />
                <span className="text-xs text-gray-600">Quick Payment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#0066FF] flex-shrink-0" />
                <span className="text-xs text-gray-600">Free Pickup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── Desktop / tablet: unchanged original layout ───────── */}
      <div className="hidden sm:block">
        <div className="rounded-2xl border border-gray-100 bg-transparent p-4 sm:p-6 flex justify-center">
          <div className="flex flex-col items-center">
            <Image
              src={imageSrc}
              alt={alt}
              width={320}
              height={420}
              className="h-[220px] sm:h-[320px] md:h-[380px] w-auto object-contain"
              sizes="(max-width: 640px) 90vw, 400px"
              priority
            />
          </div>
        </div>

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
    </div>
  );
}
