import Image from "next/image";
import { Users, ShieldCheck, TrendingUp, Zap } from "lucide-react";

interface Props {
  image: string;
  alt: string;
  soldBadgeText?: string;
}

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "100% Safe",
    subtitle: "Secure data wipes guaranteed",
  },
  {
    icon: TrendingUp,
    title: "Best Prices",
    subtitle: "Algorithmic valuation engine",
  },
  {
    icon: Zap,
    title: "Quick Payment",
    subtitle: "Instant bank transfer on pickup",
  },
];

export function ProductMediaPanel({ image, alt, soldBadgeText }: Props) {
  return (
    <div className="w-full">
      <div className="relative w-full aspect-square rounded-xl border border-gray-200 bg-white overflow-hidden shadow-[0_18px_28px_-14px_rgba(15,23,42,0.25)]">
        <Image
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${image}`}
          alt={alt}
          fill
          priority
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {soldBadgeText && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
          <Users size={14} className="text-[#0066FF]" />
          {soldBadgeText}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                <Icon size={16} className="text-[#0066FF]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
