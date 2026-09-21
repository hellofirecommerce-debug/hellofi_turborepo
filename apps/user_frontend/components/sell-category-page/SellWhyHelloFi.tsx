// components/sell-category-page/SellWhyHelloFi.tsx
import { Lock, HandCoins, UserCheck, ShieldCheck } from "lucide-react";

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
    <section className="w-full bg-[#0F0F0F] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-xs font-bold text-[#0066FF] uppercase tracking-wide">
          The {brandName} Difference
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
          Why Sell Your Old Smartphone with {brandName}
        </h2>
        <p className="mt-2 text-sm text-gray-400 max-w-2xl">
          Unlike many buyback platforms, {brandName} uses verified in-house
          pickup executives and follows a zero last-minute deduction policy.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-[#1A1A1A] border border-white/5 p-5"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white">
                  <Icon size={16} className="text-[#0F0F0F]" />
                </span>
                <p className="mt-4 text-[10px] font-semibold text-amber-400 uppercase tracking-wide">
                  {feature.tag}
                </p>
                <h3 className="mt-1 text-sm font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
