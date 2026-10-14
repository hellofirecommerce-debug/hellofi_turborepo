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
      {/* Mobile view shows below md (768px). Tightened from py-8 to py-6
          and shrunk the blur circle so the card isn't a big half-empty
          box when the photo is small/slow to load, and badge moved in
          from the very corner (left-3/top-3 → left-4/top-4 is default,
          kept, but z-index/shadow tuned) so it reads as part of the
          card instead of clipped at the edge. */}
      <div className="md:hidden">
        <div className="relative flex justify-center overflow-hidden rounded-2xl border border-[#DCE6FF] bg-gradient-to-br from-[#EEF3FF] via-[#F8FAFF] to-[#E0F2FE] py-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/10 blur-2xl"
          />

          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
            className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#0066FF] shadow-sm ring-1 ring-[#0066FF]/20 backdrop-blur"
          >
            <Users size={12} className="flex-shrink-0" />
            {soldBadgeText}
          </motion.span>

          <Image
            src={imageSrc}
            alt={alt}
            width={220}
            height={280}
            className="relative z-10 h-[180px] w-auto object-contain drop-shadow-lg"
            sizes="70vw"
            priority
          />
        </div>

        {/* mt-4 → mt-3: card and heading now sit closer together instead
            of leaving a visible gap under the hero box. */}
        <div className="mt-3 text-center">
          <h1 className="text-lg font-bold text-gray-900 leading-snug">
            Sell {productName}
          </h1>

          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 justify-items-center max-w-xs mx-auto">
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

      {/* Desktop / tablet view now starts at md (768px) */}
      <div className="hidden md:block">
        <div className="relative flex justify-center overflow-hidden rounded-2xl border border-[#DCE6FF] bg-gradient-to-br from-[#EEF3FF] via-[#F8FAFF] to-[#E0F2FE] p-6 pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/10 blur-3xl"
          />

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
