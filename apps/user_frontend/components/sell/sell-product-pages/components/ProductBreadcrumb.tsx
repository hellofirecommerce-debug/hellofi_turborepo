// components/sell/sell-product-pages/components/ProductBreadcrumb.tsx
"use client";

import { useEffect, useRef } from "react";
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
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      // Scroll to the far right to ensure the last item is fully visible
      listRef.current.scrollLeft = listRef.current.scrollWidth;
    }
  }, [items]);

  return (
    <Reveal y={-6} className="mb-3 sm:mb-6 w-full">
      <nav aria-label="breadcrumb" className="w-full">
        <ol
          ref={listRef}
          className="scrollbar-hide scroll-smooth flex flex-nowrap items-center gap-1 sm:gap-1.5 overflow-x-auto overflow-y-hidden text-xs sm:text-sm w-full"
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const truncateClasses = isLast
              ? "max-w-none whitespace-normal sm:whitespace-nowrap"
              : "max-w-[90px] sm:max-w-none truncate whitespace-nowrap flex-shrink-0";
            return (
              <li
                key={i}
                className={`flex items-center gap-1 sm:gap-1.5 min-w-0 ${
                  isLast ? "flex-shrink-0" : "flex-shrink-0"
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
                  <span className="text-gray-300 flex-shrink-0 mx-0.5">›</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </Reveal>
  );
}
