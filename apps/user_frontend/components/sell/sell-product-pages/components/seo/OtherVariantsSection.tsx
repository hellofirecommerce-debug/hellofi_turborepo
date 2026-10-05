// components/sell/sell-product-pages/components/seo/OtherVariantsSection.tsx
import Link from "next/link";

export interface VariantLinkOption {
  label: string; // full label, shown on tablet/desktop: "iPhone 17 Pro Max 12GB / 256GB"
  shortLabel?: string; // mobile only: "12GB / 256GB"
  href: string;
}

interface Props {
  productName: string;
  variants: VariantLinkOption[];
}

export function OtherVariantsSection({ productName, variants }: Props) {
  if (!variants.length) return null;

  return (
    <div className="rounded-none sm:rounded-2xl border-0 sm:border sm:border-gray-200 bg-white p-0 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-gray-900">
        Other {productName} variants
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-gray-500">
        Looking for a different storage size? Here are the other {productName}{" "}
        variants you can sell on HelloFi:
      </p>
      <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
        {variants.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="rounded-full bg-gray-100 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            <span className="sm:hidden">{v.shortLabel ?? v.label}</span>
            <span className="hidden sm:inline">{v.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
