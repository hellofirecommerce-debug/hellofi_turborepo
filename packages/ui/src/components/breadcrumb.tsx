"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "../lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumb({
  items,
  showHome = true,
  homeHref = "/",
  className,
  separator,
}: BreadcrumbProps) {
  const Separator = () => (
    <span className="text-gray-400 flex items-center">
      {separator ?? <ChevronRight size={14} />}
    </span>
  );

  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm", className)}
    >
      {showHome && (
        <>
          <Link
            href={homeHref}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          {items.length > 0 && <Separator />}
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {isLast || !item.href ? (
              <span className="font-medium text-gray-900">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                {item.label}
              </Link>
            )}
            {!isLast && <Separator />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
