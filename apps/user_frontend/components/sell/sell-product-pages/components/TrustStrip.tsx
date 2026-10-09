// components/sell/sell-product-pages/components/TrustStrip.tsx
import { ShieldCheck, Tag, Zap } from "lucide-react";
import { RevealGroup, RevealItem } from "@repo/ui";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "100% Safe & Secure",
    subtitle: "Your data is fully protected",
    circle: "bg-[#E4EEFF]",
    iconClass: "text-[#1F5FD6]",
    solid: false,
  },
  {
    icon: Tag,
    title: "Best Market Prices",
    subtitle: "AI-powered valuation engine",
    circle: "bg-[#FFEBD4]",
    iconClass: "text-[#B7682A]",
    solid: true,
  },
  {
    icon: Zap,
    title: "Quick Payment",
    subtitle: "Instant bank transfer on pickup",
    circle: "bg-[#E0F2FE]",
    iconClass: "text-[#38BDF8]",
    solid: true,
  },
];

export function TrustStrip() {
  return (
    <RevealGroup
      stagger={0.12}
      className="mt-6 hidden rounded-2xl bg-white px-6 py-5 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.18)] ring-1 ring-gray-100 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-gray-200/70"
    >
      {ITEMS.map(
        ({ icon: Icon, title, subtitle, circle, iconClass, solid }) => (
          <RevealItem
            key={title}
            y={12}
            className="group flex items-center gap-4 px-6 sm:first:pl-0 sm:last:pr-0"
          >
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${circle}`}
            >
              <Icon
                size={24}
                className={iconClass}
                fill={solid ? "currentColor" : "none"}
              />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight text-gray-900">
                {title}
              </p>
              <p className="mt-0.5 text-sm leading-snug text-gray-500">
                {subtitle}
              </p>
            </div>
          </RevealItem>
        ),
      )}
    </RevealGroup>
  );
}
