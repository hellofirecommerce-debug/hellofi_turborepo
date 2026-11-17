// components/sell/sell-product-pages/components/PriceRangeCard.tsx
import Link from "next/link";
import { Button } from "@repo/ui";

const formatPrice = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

interface Props {
  low: number;
  high?: number; // omit to show a single exact price instead of a range
  ctaLabel?: string; // omit to render the card with no CTA button at all
  ctaHref?: string; // when set, the CTA is a link (works in server components)
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  note?: string;
}

export function PriceRangeCard({
  low,
  high,
  ctaLabel,
  ctaHref,
  onCtaClick,
  ctaDisabled = false,
  note = "Final price depends on device condition check.",
}: Props) {
  const isRange = high !== undefined && high !== low;

  const ctaClass = `relative overflow-hidden mt-4 w-full sm:w-3/4 lg:w-2/4 h-16 rounded-2xl text-base ${
    ctaDisabled
      ? "bg-gray-200 text-gray-400 hover:bg-gray-200"
      : "bg-[#0066FF] text-white hover:bg-[#0052cc]"
  }`;

  const shine = !ctaDisabled && (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine-sweep bg-gradient-to-r from-transparent via-white/25 to-transparent"
    />
  );

  const label = (
    <span className="relative z-10 inline-flex items-center gap-2">
      {ctaLabel} →
    </span>
  );

  return (
    <div className="rounded-xl bg-variant-selected-bg border border-variant-selected-border p-5 mt-4 md:mt-0 text-center">
      <p className="text-[11px] font-bold text-sell-blue uppercase tracking-wide">
        {isRange ? "Estimated Price Range" : "Estimated Price"}
      </p>
      <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-sell-blue">
        {isRange
          ? `${formatPrice(low)} – ${formatPrice(high!)}`
          : formatPrice(low)}
      </p>

      {ctaLabel &&
        (ctaHref ? (
          <Link
            href={ctaHref}
            className={`${ctaClass} inline-flex items-center justify-center font-semibold transition-colors relative z-20`}
          >
            {shine}
            {label}
          </Link>
        ) : (
          <Button
            type="button"
            size="xl"
            onClick={onCtaClick}
            disabled={ctaDisabled}
            className={ctaClass}
          >
            {shine}
            {label}
          </Button>
        ))}

      {note && <p className="mt-2 text-[11px] text-gray-500">{note}</p>}
    </div>
  );
}
