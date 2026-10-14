// components/sell/sell-product-pages/components/ProductBreadcrumb.tsx
import Link from "next/link";
import { Reveal } from "@repo/ui";

interface Item {
  label: string;
  href?: string;
}

interface Props {
  items: Item[];
}

export function ProductBreadcrumb({ items }: Props) {
  return (
    <Reveal y={-6} className="mb-3 sm:mb-6 w-full">
      <nav>
        {/* flex-wrap → flex-nowrap + overflow-x-auto: scrolls horizontally
            on mobile instead of wrapping to a second line. Scrollbar is
            hidden via the inline style (Firefox) + the .no-scrollbar
            class below (WebKit/Chrome/Safari) — add this once to your
            global CSS if it isn't there already:
              .no-scrollbar::-webkit-scrollbar { display: none; } */}
        <ol
          className="no-scrollbar flex flex-nowrap items-center gap-1 sm:gap-1.5 overflow-x-auto text-xs sm:text-sm"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            // Every earlier crumb stays short and non-wrapping so the row
            // scrolls cleanly; the last (current) crumb is always shown
            // in full — e.g. "Apple iPhone 16 (6GB/128GB)" — never
            // truncated, and allowed to wrap if it's long.
            const truncateClasses = isLast
              ? "max-w-none whitespace-normal sm:whitespace-nowrap"
              : "max-w-[90px] sm:max-w-none truncate whitespace-nowrap flex-shrink-0";
            return (
              <li
                key={i}
                className={`flex items-center gap-1 sm:gap-1.5 min-w-0 ${
                  isLast ? "flex-shrink-0" : ""
                }`}
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={`text-gray-500 hover:text-[#0066FF] transition-colors ${truncateClasses}`}
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`${truncateClasses} ${
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
    </Reveal>
  );
}
