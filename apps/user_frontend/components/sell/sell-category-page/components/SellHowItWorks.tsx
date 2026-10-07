// components/sell-category-page/SellHowItWorks.tsx
import Link from "next/link";
import {
  Smartphone,
  RefreshCw,
  Truck,
  Wallet,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

interface Props {
  ctaHref?: string;
}

const CARD_CLASS =
  "group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/15";
const ICON_CLASS =
  "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110";
const NUM_CLASS =
  "mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded bg-[#0066FF] text-white text-[10px] font-bold";

export function SellHowItWorks({ ctaHref = "#" }: Props) {
  return (
    <section className="w-full">
      {/* Blue top band — heading only */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#0052D4] via-[#0066FF] to-[#4B8BFF] pt-14 sm:pt-20 pb-28 sm:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 animate-pulse rounded-full bg-[#38BDF8]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="relative max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white text-center">
              How to Sell Your Used Mobile Phone on HelloFi
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100 text-center max-w-xl mx-auto leading-relaxed">
              Experience a seamless, secure, and transparent way to trade in
              your devices for the best market value.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Cards — pulled up to overlap the blue band */}
      <div className="w-full">
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 pb-14 sm:pb-20"
          style={{ marginTop: "-72px" }}
        >
          <RevealGroup
            stagger={0.12}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Card 1 */}
            <RevealItem className="h-full">
              <div className={CARD_CLASS}>
                <span className={ICON_CLASS}>
                  <Smartphone size={20} className="text-[#0066FF]" />
                </span>
                <div className="mt-4 flex items-start gap-2">
                  <span className={NUM_CLASS}>01</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    Select Your Brand &amp; Model
                  </h3>
                </div>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  Choose from top global brands like Apple, Samsung, OnePlus,
                  Google, Xiaomi, and more. Can&apos;t find your specific model?
                  Use our quick search tool or request a custom quote.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["Apple", "Samsung", "Google"].map((brand) => (
                    <span
                      key={brand}
                      className="text-[10px] font-medium text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 transition-colors group-hover:border-[#0066FF]/40 group-hover:text-[#0066FF]"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </RevealItem>

            {/* Card 2 */}
            <RevealItem className="h-full">
              <div className={CARD_CLASS}>
                <span className={ICON_CLASS}>
                  <RefreshCw size={20} className="text-[#0066FF]" />
                </span>
                <div className="mt-4 flex items-start gap-2">
                  <span className={NUM_CLASS}>02</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    Get Instant Quote
                  </h3>
                </div>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  Select your storage, RAM, and device condition. Our advanced
                  algorithm provides a real-time market-best price immediately,
                  no form submissions or waiting for callbacks.
                </p>
                <div className="mt-4 flex-1 flex items-end">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0066FF]">
                    <TrendingUp size={14} />₹ Best Value
                  </span>
                </div>
              </div>
            </RevealItem>

            {/* Card 3 */}
            <RevealItem className="h-full">
              <div className={CARD_CLASS}>
                <span className={ICON_CLASS}>
                  <Truck size={20} className="text-[#0066FF]" />
                </span>
                <div className="mt-4 flex items-start gap-2">
                  <span className={NUM_CLASS}>03</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    Free Doorstep Pickup
                  </h3>
                </div>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  Schedule a convenient time from home or office. A verified
                  HelloFi executive visits your location for a free inspection.
                  Prefer a face-to-face visit? Visit any of our experience
                  centers.
                </p>
                <div className="mt-4 flex-1 flex items-end">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-emerald-500 rounded-full px-2.5 py-1">
                    <BadgeCheck size={12} />
                    VERIFIED LOGISTICS
                  </span>
                </div>
              </div>
            </RevealItem>

            {/* Card 4 */}
            <RevealItem className="h-full">
              <div className={CARD_CLASS}>
                <span className={ICON_CLASS}>
                  <Wallet size={20} className="text-[#0066FF]" />
                </span>
                <div className="mt-4 flex items-start gap-2">
                  <span className={NUM_CLASS}>04</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    Instant Payment
                  </h3>
                </div>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  Once the inspection matches your self-assessment, the payment
                  is transferred instantly to your preferred bank account or UPI
                  ID. No delays, no haggling, just money in your pocket.
                </p>
                <div className="mt-4 flex-1 flex items-end">
                  <Link
                    href={ctaHref}
                    className="group/cta inline-flex items-center justify-center gap-1 h-9 px-4 rounded-lg bg-gradient-to-r from-[#0066FF] to-[#3B82F6] text-white text-xs font-semibold shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40"
                  >
                    Sell My Phone Now
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover/cta:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
