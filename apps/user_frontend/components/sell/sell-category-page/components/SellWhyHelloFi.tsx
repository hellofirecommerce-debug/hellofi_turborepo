// components/sell-category-page/SellWhyHelloFi.tsx
import { Lock, HandCoins, UserCheck, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

interface Feature {
  icon: React.ElementType;
  tag: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Lock,
    tag: "NO SURPRISES",
    title: "Best Price for Your Old Device",
    description:
      "HelloFi calculates your phone's resale price based on real-time resale market demand, not a fixed depreciation chart.",
  },
  {
    icon: HandCoins,
    tag: "MONEY BACK",
    title: "Zero Last Minute Deductions",
    description:
      "This is what sets HelloFi apart. The price you see is the price you get, provided your device matches the condition described.",
  },
  {
    icon: UserCheck,
    tag: "SAFE & TRUSTED",
    title: "HelloFi Verified Pickup",
    description:
      "Our verified executives come to your home or office, verify your phone. Every pickup is handled by our trained, in-house team.",
  },
  {
    icon: ShieldCheck,
    tag: "100% PRIVATE",
    title: "Instant Payment & Purchase Bill",
    description:
      "Payment is made immediately via UPI, NEFT bank transfer, or cash. A valid bill is provided for every transaction.",
  },
];

export function SellWhyHelloFi({
  brandName = "HelloFi",
}: {
  brandName?: string;
}) {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B0F1A] py-16 sm:py-20">
      {/* soft glowing blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 animate-pulse rounded-full bg-[#0066FF]/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 animate-pulse rounded-full bg-[#38BDF8]/20 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4">
        <Reveal>
          <p className="text-xs font-bold text-[#4D94FF] uppercase tracking-widest">
            The {brandName} Difference
          </p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">
            Why Sell Your Old Smartphone with {brandName}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl">
            Unlike many buyback platforms, {brandName} uses verified in-house
            pickup executives and follows a zero last-minute deduction policy.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.1}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <RevealItem key={feature.title} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0066FF]/50 hover:bg-white/[0.07]">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0066FF] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0066FF] to-[#38BDF8] text-white shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon size={18} />
                  </span>
                  <p className="mt-5 text-[10px] font-semibold text-amber-400 uppercase tracking-widest">
                    {feature.tag}
                  </p>
                  <h3 className="mt-1.5 text-base font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
