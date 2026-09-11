"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Tag, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/buy-used-gadgets", icon: ShoppingBag },
  { label: "Sell", href: "/sell", icon: Tag },
  { label: "Profile", href: "/profile", icon: User },
];

const BOTTOM_NAV_ALLOWED_PATHS = [
  "/",
  "/buy-used-mobile-phones",
  "/buy-used-laptops",
  "/buy-used-tablets",
  "/buy-used-smartwatches",
  "/buy-used-gadgets",
];

export function BottomNav() {
  const pathname = usePathname();

  const normalizedPath =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const showBottomNav = BOTTOM_NAV_ALLOWED_PATHS.includes(normalizedPath);

  if (!showBottomNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <Icon
                size={22}
                className={isActive ? "text-[#4F46E5]" : "text-gray-400"}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[11px] font-medium ${
                  isActive ? "text-[#4F46E5]" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
