// components/category-page/ShopByBrand.tsx
import Link from "next/link";

interface Brand {
  name: string;
  models: string;
  href: string;
  borderColor: string;
}

const BRANDS: Brand[] = [
  {
    name: "Apple",
    models: "iPhones, MacBooks, iPads, Watches",
    href: "/buy-used-gadgets?brand=apple",
    borderColor: "border-orange-400",
  },
  {
    name: "Samsung",
    models: "Galaxy S, Z Fold, Tablets, Watches",
    href: "/buy-used-gadgets?brand=samsung",
    borderColor: "border-blue-400",
  },
  {
    name: "OnePlus",
    models: "Nord, 12R, 12 Series",
    href: "/buy-used-gadgets?brand=oneplus",
    borderColor: "border-emerald-400",
  },
  {
    name: "Google",
    models: "Pixel 8, 7A, Watch",
    href: "/buy-used-gadgets?brand=google",
    borderColor: "border-amber-400",
  },
  {
    name: "Dell",
    models: "XPS, Inspiron",
    href: "/buy-used-gadgets?brand=dell",
    borderColor: "border-rose-400",
  },
  {
    name: "HP",
    models: "Spectre, Pavilion",
    href: "/buy-used-gadgets?brand=hp",
    borderColor: "border-sky-400",
  },
];

export function ShopByBrand() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
            Shop by Brand
          </h2>
          <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-primary-surface text-primary">
            Top Brands
          </span>
        </div>

        <Link
          href="/buy-used-gadgets"
          className="text-xs sm:text-sm font-medium text-primary hover:underline whitespace-nowrap"
        >
          Browse All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-4">
        {BRANDS.map(({ name, models, href, borderColor }) => (
          <Link
            key={name}
            href={href}
            className={`flex items-center gap-2.5 sm:gap-3 rounded-xl border-2 ${borderColor} bg-white px-3 py-3 sm:px-3.5 sm:py-3.5 hover:-translate-y-0.5 transition-transform`}
          >
            <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-gray-400">
                {name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-black leading-tight truncate">
                {name}
              </p>
              <p className="text-[9px] sm:text-[11px] text-gray-400 leading-tight truncate">
                {models}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
