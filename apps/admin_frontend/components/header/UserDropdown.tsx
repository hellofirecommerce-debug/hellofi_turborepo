"use client";
import React, { useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@repo/ui";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // close on outside click
  React.useEffect(() => {
    const close = () => setIsOpen(false);
    if (isOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-gray-700"
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100">
          <User size={18} className="text-gray-600" />
        </span>
        <span className="font-medium text-sm">Admin</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-50">
          <a
            href="/signin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut size={16} />
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}
