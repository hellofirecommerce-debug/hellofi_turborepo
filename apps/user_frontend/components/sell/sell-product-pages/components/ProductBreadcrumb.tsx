// components/sell/sell-product-pages/components/ProductBreadcrumb.tsx
import Link from "next/link";

interface Item {
  label: string;
  href?: string;
}

interface Props {
  items: Item[];
}

export function ProductBreadcrumb({ items }: Props) {
  return (
    <nav className="mb-3 sm:mb-6 w-full">
      <ol className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          // Mobile: truncate to a fixed width with ellipsis (except the last crumb).
          // sm and up: max-w-none removes the cap so the full label always shows.
          const truncateClasses = isLast
            ? "max-w-none"
            : "max-w-[70px] sm:max-w-none truncate";

          return (
            <li key={i} className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`text-gray-500 hover:text-[#0066FF] transition-colors whitespace-nowrap ${truncateClasses}`}
                  title={item.label}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`whitespace-nowrap ${truncateClasses} ${
                    isLast ? "text-gray-900 font-semibold" : "text-gray-500"
                  }`}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-gray-300 flex-shrink-0">›</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
