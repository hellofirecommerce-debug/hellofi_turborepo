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

interface Props {
  ctaHref?: string;
}

export function SellHowItWorks({ ctaHref = "#" }: Props) {
  return (
    <section className="w-full">
      {/* Blue top band — heading only */}
      <div className="w-full bg-gradient-to-br from-[#0052D4] to-[#0066FF] pt-12 sm:pt-16 pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white text-center">
            How to Sell Your Used Mobile Phone on HelloFi
          </h2>
          <p className="mt-3 text-sm text-blue-100 text-center max-w-xl mx-auto leading-relaxed">
            Experience a seamless, secure, and transparent way to trade in your
            devices for the best market value.
          </p>
        </div>
      </div>

      {/* White bottom band — cards, pulled up to overlap the blue band */}
      <div className="w-full ">
        <div
          className="relative z-10 max-w-7xl mx-auto px-4 pb-12 sm:pb-16"
          style={{ marginTop: "-64px" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="rounded-2xl bg-white shadow-lg shadow-black/5 border border-gray-100 p-5 flex flex-col">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-100">
                <Smartphone size={20} className="text-[#0066FF]" />
              </span>
              <div className="mt-4 flex items-start gap-2">
                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded bg-[#0066FF] text-white text-[10px] font-bold">
                  01
                </span>
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
                    className="text-[10px] font-medium text-gray-500 border border-gray-200 rounded-full px-2.5 py-1"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-white shadow-lg shadow-black/5 border border-gray-100 p-5 flex flex-col">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-100">
                <RefreshCw size={20} className="text-[#0066FF]" />
              </span>
              <div className="mt-4 flex items-start gap-2">
                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded bg-[#0066FF] text-white text-[10px] font-bold">
                  02
                </span>
                <h3 className="text-sm font-bold text-gray-900 leading-snug">
                  Get Instant Quote
                </h3>
              </div>
              <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                Select your storage, RAM, and device condition. Our advanced
                algorithm provides a real-time market-best price immediately, no
                form submissions or waiting for callbacks.
              </p>
              <div className="mt-4 flex-1 flex items-end">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0066FF]">
                  <TrendingUp size={14} />₹ Best Value
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-white shadow-lg shadow-black/5 border border-gray-100 p-5 flex flex-col">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-100">
                <Truck size={20} className="text-[#0066FF]" />
              </span>
              <div className="mt-4 flex items-start gap-2">
                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded bg-[#0066FF] text-white text-[10px] font-bold">
                  03
                </span>
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

            {/* Card 4 */}
            <div className="rounded-2xl bg-white shadow-lg shadow-black/5 border border-gray-100 p-5 flex flex-col">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-100">
                <Wallet size={20} className="text-[#0066FF]" />
              </span>
              <div className="mt-4 flex items-start gap-2">
                <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded bg-[#0066FF] text-white text-[10px] font-bold">
                  04
                </span>
                <h3 className="text-sm font-bold text-gray-900 leading-snug">
                  Instant Payment
                </h3>
              </div>
              <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                Once the inspection matches your self-assessment, the payment is
                transferred instantly to your preferred bank account or UPI ID.
                No delays, no haggling, just money in your pocket.
              </p>
              <div className="mt-4">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center justify-center gap-1 h-9 px-4 rounded-lg bg-[#0066FF] text-white text-xs font-semibold hover:bg-[#0052cc] transition-colors"
                >
                  Sell My Phone Now
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
