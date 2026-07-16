import { ShieldCheck, RotateCcw, Truck, BadgePercent } from "lucide-react";

interface TrustBadge {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  borderColor: string;
}

const TRUST_BADGES: TrustBadge[] = [
  {
    icon: ShieldCheck,
    title: "Brand / Seller Warranty",
    subtitle: "Available on most devices",
    borderColor: "border-trust-gold",
  },
  {
    icon: RotateCcw,
    title: "Strictly Pre-Owned",
    subtitle: "No refurbished or repaired gadgets",
    borderColor: "border-trust-purple",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Pan India shipping",
    borderColor: "border-trust-green",
  },
  {
    icon: BadgePercent,
    title: "EMI Options Available",
    subtitle: "No/Low Cost EMI on eligible products",
    borderColor: "border-trust-brown",
  },
];

export function TrustBadgeStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {TRUST_BADGES.map(({ icon: Icon, title, subtitle, borderColor }) => (
        <div
          key={title}
          className={`flex items-center gap-2.5 sm:gap-3 rounded-xl border-2 ${borderColor} bg-trust-bg px-3 py-3 sm:px-4 sm:py-4`}
        >
          <Icon className="shrink-0 text-black" size={20} strokeWidth={2} />
          <div className="min-w-0">
            <p className="text-[11px] sm:text-sm lg:text-base font-semibold text-black leading-tight truncate">
              {title}
            </p>
            <p className="text-[9px] sm:text-xs text-trust-subtitle leading-tight truncate">
              {subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
