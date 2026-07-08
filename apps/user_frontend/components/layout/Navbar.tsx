"use client";

import Link from "next/link";
import { Button } from "@repo/ui";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 bg-[#4F46E5] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="font-extrabold text-[#1a1a2e] text-xl tracking-tight">
              HELLOFI
            </span>
          </Link>

          {/* Desktop Nav */}
          <DesktopNav />

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button
              asChild
              variant="default"
              size="md"
              className="rounded-full bg-black text-white hover:bg-primary-light-hover w-full cursor-pointer"
            >
              <Link href="/auth/login">LOGIN / SIGNUP</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </header>
  );
}
