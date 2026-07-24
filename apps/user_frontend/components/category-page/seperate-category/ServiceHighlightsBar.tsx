// components/category-page/shared/ServiceHighlightsBar.tsx
import {
  Video,
  ShieldCheck,
  Phone,
  Wallet,
  Store,
  Camera,
  BadgeCheck,
  Cable,
  FileText,
} from "lucide-react";

interface Highlight {
  icon: React.ElementType;
  label: string;
}

const HIGHLIGHTS: Highlight[] = [
  { icon: Video, label: "Live Video Demo" },
  { icon: ShieldCheck, label: "Strictly Preowned" },
  { icon: Phone, label: "Lifetime Call Support" },
  { icon: Wallet, label: "COD Option" },
  { icon: Store, label: "Store Pickup" },
  { icon: Camera, label: "Real Photos" },
  { icon: BadgeCheck, label: "Brand Warranty" },
  { icon: Cable, label: "Original Accessories" },
];

export function ServiceHighlightsBar() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-3 sm:gap-4 items-center">
      {/* icon row */}
      <div className="bg-primary-surface rounded-xl px-3 py-3 sm:px-5 sm:py-3.5 w-full">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-6 sm:gap-y-2.5">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
            >
              <Icon
                size={13}
                className="shrink-0 text-primary sm:w-[14px] sm:h-[14px]"
              />
              <span className="text-[10px] sm:text-xs font-medium text-black">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* note bar — centered, content-width */}
      <div className="bg-primary-surface/60 border border-primary/10 rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-start gap-2.5 w-fit max-w-full sm:max-w-xl mx-auto">
        <FileText size={16} className="shrink-0 text-primary mt-0.5" />
        <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed">
          Try Before You Buy At Your Doorstep (Only Within 5Kms from
          Koramangala, Bangalore)
        </p>
      </div>
    </div>
  );
}
