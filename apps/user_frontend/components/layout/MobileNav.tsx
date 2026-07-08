"use client";

import Link from "next/link";
import { Button } from "@repo/ui";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAV_LINKS } from "./nav-data";

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
      {NAV_LINKS.map((link) =>
        link.children ? (
          <div key={link.label}>
            <button
              type="button"
              className="w-full flex items-center justify-between py-3 text-[15px] text-gray-800 hover:text-primary font-semibold cursor-pointer transition-colors"
              onClick={() =>
                setExpanded(expanded === link.label ? null : link.label)
              }
            >
              {link.label}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  expanded === link.label ? "rotate-180" : ""
                }`}
              />
            </button>
            {expanded === link.label && (
              <div className="flex flex-col pl-4 pb-2">
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="py-2 text-sm text-gray-600 hover:text-primary font-medium transition-colors cursor-pointer"
                    onClick={onClose}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link
            key={link.href}
            href={link.href!}
            className="py-3 text-[15px] text-gray-800 hover:text-primary font-semibold transition-colors cursor-pointer"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ),
      )}

      <Button
        asChild
        variant="default"
        size="md"
        className="rounded-full bg-black text-white hover:bg-primary-light-hover w-full mt-3 cursor-pointer"
      >
        <Link href="/auth/login" onClick={onClose}>
          LOGIN / SIGNUP
        </Link>
      </Button>
    </div>
  );
}
