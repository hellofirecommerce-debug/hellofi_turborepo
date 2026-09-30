const formatPrice = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

interface Props {
  low: number;
  high?: number; // omit to show a single exact price instead of a range
  ctaLabel: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  note?: string;
}

export function PriceRangeCard({
  low,
  high,
  ctaLabel,
  onCtaClick,
  ctaDisabled = false,
  note = "Final price depends on device condition check.",
}: Props) {
  const isRange = high !== undefined && high !== low;

  return (
    <div className="rounded-xl bg-blue-50 border border-blue-100 p-5 text-center">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
        {isRange ? "Estimated Price Range" : "Estimated Price"}
      </p>
      <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#0066FF]">
        {isRange
          ? `${formatPrice(low)} – ${formatPrice(high!)}`
          : formatPrice(low)}
      </p>

      <button
        type="button"
        onClick={onCtaClick}
        disabled={ctaDisabled}
        className={`mt-4 w-full h-11 rounded-xl text-sm font-semibold transition-colors ${
          ctaDisabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#0066FF] text-white hover:bg-[#0052cc] cursor-pointer"
        }`}
      >
        {ctaLabel} →
      </button>

      {note && <p className="mt-2 text-[11px] text-gray-500">{note}</p>}
    </div>
  );
}
