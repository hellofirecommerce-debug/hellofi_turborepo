// components/category-page/EMIOptionsSection.tsx
import Image from "next/image";
import {
  Landmark,
  CreditCard,
  ShieldCheck,
  Layers,
  BadgeCheck,
  ShieldOff,
  Zap,
} from "lucide-react";

export function EMIOptionsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* ============ Bank EMI Options ============ */}
        <div
          className="relative rounded-2xl border overflow-hidden p-4 sm:p-5 lg:p-6 h-full"
          style={{
            background: "linear-gradient(135deg, #1F2A3C 0%, #040E1F 100%)",
            borderColor: "#424656",
          }}
        >
          {/* ---- mobile/tablet stacked layout (below lg) ---- */}
          <div className="flex flex-col lg:hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Landmark size={18} className="text-blue-400" />
              </div>
              <span className="text-[9px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-full px-2.5 py-1 whitespace-nowrap">
                SECURE PROCESSING
              </span>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/images/buy-category/Bank_EMI.png"
                alt="Bank EMI Options"
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1.5">
                Bank EMI Options
              </h3>
              <p className="text-xs font-semibold text-blue-400 mb-2">
                No Cost &amp; Low Cost EMI
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                Available through major banks and financial partners.
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-blue-400 shrink-0" />
                  <span className="text-[10px] text-gray-300">
                    Instant Approval
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers size={13} className="text-blue-400 shrink-0" />
                  <span className="text-[10px] text-gray-300">
                    Flexible Tenures
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---- desktop 65/35 layout (lg and above) ---- */}
          <div className="hidden lg:block h-full">
            <span className="absolute top-6 right-6 text-[10px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-full px-2.5 py-1 whitespace-nowrap">
              SECURE PROCESSING
            </span>

            <div className="grid grid-cols-[65%_35%] items-center gap-2 h-full">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5">
                  <Landmark size={18} className="text-blue-400" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-1.5">
                  Bank EMI Options
                </h3>
                <p className="text-sm font-semibold text-blue-400 mb-2">
                  No Cost &amp; Low Cost EMI
                </p>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  Available through major banks and financial partners.
                </p>

                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-blue-400 shrink-0" />
                    <span className="text-[11px] text-gray-300">
                      Instant Approval
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers size={13} className="text-blue-400 shrink-0" />
                    <span className="text-[11px] text-gray-300">
                      Flexible Tenures
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative w-full aspect-square">
                <Image
                  src="/images/buy-category/Bank_EMI.png"
                  alt="Bank EMI Options"
                  fill
                  className="object-contain"
                  sizes="17vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============ EMI & Financing Options ============ */}
        <div
          className="relative rounded-2xl border overflow-hidden p-4 sm:p-5 lg:p-6 h-full"
          style={{
            background: "linear-gradient(135deg, #1F2A3C 0%, #040E1F 100%)",
            borderColor: "#424656",
          }}
        >
          {/* ---- mobile/tablet stacked layout (below lg) ---- */}
          <div className="flex flex-col lg:hidden">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  EMI &amp; Financing Options
                </h3>
                <p className="text-[11px] text-gray-400">
                  Snapmint 0% EMI on UPI
                </p>
              </div>
              <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <CreditCard size={18} className="text-blue-400" />
              </div>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/images/buy-category/Finance_Options.png"
                alt="EMI & Financing Options"
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-blue-400 shrink-0" />
                <span className="text-[11px] text-gray-300">
                  Instant credit approval
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldOff size={14} className="text-blue-400 shrink-0" />
                <span className="text-[11px] text-gray-300">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-blue-400 shrink-0" />
                <span className="text-[11px] text-gray-300">
                  Quick and hassle-free financing
                </span>
              </div>
            </div>
          </div>

          {/* ---- desktop 65/35 layout (lg and above) ---- */}
          <div className="hidden lg:block h-full">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <CreditCard size={18} className="text-blue-400" />
            </div>

            <div className="grid grid-cols-[65%_35%] items-center gap-2 h-full">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  EMI &amp; Financing Options
                </h3>
                <p className="text-xs text-gray-400 mb-5">
                  Snapmint 0% EMI on UPI
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs text-gray-300">
                      Instant credit approval
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldOff size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs text-gray-300">
                      No credit card required
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs text-gray-300">
                      Quick and hassle-free financing
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative w-full aspect-square">
                <Image
                  src="/images/buy-category/Finance_Options.png"
                  alt="EMI & Financing Options"
                  fill
                  className="object-contain"
                  sizes="17vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
