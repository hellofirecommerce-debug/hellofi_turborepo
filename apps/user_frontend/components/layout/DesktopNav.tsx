"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "./nav-data";

export function DesktopNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {NAV_LINKS.map((link) =>
        link.children ? (
          <div
            key={link.label}
            className="relative"
            onMouseEnter={() => setOpenDropdown(link.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-[15px] text-gray-700 hover:text-primary font-semibold transition-colors cursor-pointer"
            >
              {link.label}
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  openDropdown === link.label ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === link.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    duration: 0.18,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  className="absolute left-0 top-full pt-3"
                >
                  <div className="min-w-[240px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-5 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            key={link.href}
            href={link.href!}
            className="text-[15px] text-gray-700 hover:text-primary font-semibold transition-colors cursor-pointer"
          >
            {link.label}
          </Link>
        ),
      )}
    </nav>
  );
}
