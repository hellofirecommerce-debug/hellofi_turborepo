import { ShieldCheck, Truck, Banknote, Lock } from "lucide-react";
import { RevealGroup, RevealItem } from "@repo/ui";

interface Badge {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

const BADGES: Badge[] = [
  { icon: ShieldCheck, title: "Price Locked", subtitle: "Valid for 7 days" },
  { icon: Truck, title: "Free Pickup", subtitle: "At your doorstep" },
  { icon: Banknote, title: "Instant Pay", subtitle: "Cash or UPI" },
  { icon: Lock, title: "Data Secure", subtitle: "100% Wipe Guarantee" },
];

export function TrustBadgeStrip() {
  return (
    <section className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <RevealGroup
        stagger={0.07}
        className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200"
      >
        {BADGES.map((badge) => {
          const Icon = badge.icon;
          return (
            <RevealItem
              key={badge.title}
              y={14}
              className="group flex flex-col items-center justify-center gap-2 py-5 px-3 text-center transition-colors duration-300 hover:bg-blue-50/40"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0066FF]">
                <Icon
                  size={18}
                  className="text-[#0066FF] transition-colors duration-300 group-hover:text-white"
                />
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {badge.title}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  {badge.subtitle}
                </p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
