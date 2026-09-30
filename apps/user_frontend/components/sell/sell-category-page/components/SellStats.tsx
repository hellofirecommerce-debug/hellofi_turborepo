// components/sell-category-page/SellStats.tsx
interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "80,000+", label: "Active Users" },
  { value: "4.9 ★", label: "Google Rating" },
  { value: "200+", label: "Areas Covered" },
  { value: "10,000+", label: "Models Accepted" },
];

export function SellStats() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-lg sm:text-2xl font-extrabold text-gray-900">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
