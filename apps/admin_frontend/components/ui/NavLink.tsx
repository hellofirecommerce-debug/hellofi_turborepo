// src/components/ui/NavLink.tsx
"use client";
import Link from "next/link";
import { ComponentProps } from "react";

export function NavLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        (window as any).__startNavigation?.();
        onClick?.(e);
      }}
    />
  );
}
