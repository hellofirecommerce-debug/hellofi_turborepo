// components/sell/sell-product-pages/components/ProductMediaPanel.tsx
"use client";

import Image from "next/image";
import { motion } from "motion/react";
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
          <div className="flex-shrink-0 w-28 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-[#EEF3FF] via-[#F8FAFF] to-[#E0F2FE] flex items-center justify-center">
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

      {/* ───────── Desktop / tablet: tinted image card, badge top-left ───────── */}
      <div className="hidden sm:block">
        <div className="relative flex justify-center overflow-hidden rounded-2xl border border-[#DCE6FF] bg-gradient-to-br from-[#EEF3FF] via-[#F8FAFF] to-[#E0F2FE] p-6 pt-16">
          {/* soft glow behind the phone */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/10 blur-3xl"
          />

          {/* Sold badge — top-left on the image */}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
            className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#0066FF] shadow-sm ring-1 ring-[#0066FF]/20 backdrop-blur"
          >
            <Users size={14} className="flex-shrink-0" />
            {soldBadgeText}
          </motion.span>

          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative z-10 flex flex-col items-center"
          >
            <Image
              src={imageSrc}
              alt={alt}
              width={320}
              height={420}
              className="h-[220px] sm:h-[320px] md:h-[380px] w-auto object-contain drop-shadow-xl"
              sizes="(max-width: 640px) 90vw, 400px"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
