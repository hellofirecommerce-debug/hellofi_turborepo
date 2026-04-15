"use client";
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@repo/ui";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const close = () => setIsOpen(false);
    if (isOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        title="button 2"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((p) => !p);
        }}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
      >
        <Bell size={18} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Notifications</p>
          </div>
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            No new notifications
          </div>
        </div>
      )}
    </div>
  );
}
