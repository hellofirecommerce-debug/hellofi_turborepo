// components/shop-by-budget/ShopByBudget.tsx
import Link from "next/link";
import { Link2, Tag, Star, TrendingUp, Award, Zap } from "lucide-react";

interface BudgetRange {
  icon: React.ElementType;
  range: string;
  label: string;
  count: string;
  href: string;
}

const BUDGET_RANGES: BudgetRange[] = [
  {
    icon: Link2,
    range: "Under ₹10K",
    label: "Budget Picks",
    count: "120+ devices",
    href: "/buy-used-gadgets?max=10000",
  },
  {
    icon: Tag,
    range: "₹10K – ₹25K",
    label: "Best Value",
    count: "240+ devices",
    href: "/buy-used-gadgets?min=10000&max=25000",
  },
  {
    icon: Star,
    range: "₹25K – ₹50K",
    label: "Mid-Range",
    count: "310+ devices",
    href: "/buy-used-gadgets?min=25000&max=50000",
  },
  {
    icon: TrendingUp,
    range: "₹50K – ₹80K",
    label: "Premium",
    count: "180+ devices",
    href: "/buy-used-gadgets?min=50000&max=80000",
  },
  {
    icon: Award,
    range: "₹80K – ₹1.2L",
    label: "High-End",
    count: "95+ devices",
    href: "/buy-used-gadgets?min=80000&max=120000",
  },
  {
    icon: Zap,
    range: "Above ₹1.2L",
    label: "Flagship Tier",
    count: "60+ devices",
    href: "/buy-used-gadgets?min=120000",
  },
];

export function ShopByBudget() {
  return (
    <section
      className="w-full"
      style={{
        background: "linear-gradient(135deg, #00BC7D 0%, #179791 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              Shop by Budget
            </h2>
            <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white">
              Price Ranges
            </span>
          </div>

          <Link
            href="/buy-used-gadgets"
            className="text-xs sm:text-sm font-medium text-white hover:underline whitespace-nowrap"
          >
            Browse All →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 min-[820px]:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-4">
          {BUDGET_RANGES.map(({ icon: Icon, range, label, count, href }) => (
            <Link
              key={range}
              href={href}
              className="bg-white rounded-xl p-3 sm:p-4 flex flex-col items-center text-center gap-1.5 hover:-translate-y-0.5 transition-transform"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-surface flex items-center justify-center">
                <Icon size={16} className="text-primary" />
              </div>
              <p className="text-[11px] sm:text-xs lg:text-sm font-bold text-black leading-tight">
                {range}
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 leading-tight">
                {label}
              </p>
              <p className="text-[9px] sm:text-[10px] font-semibold text-primary">
                {count}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
