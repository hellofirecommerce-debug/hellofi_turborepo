"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}

export function ConditionModal({
  open,
  title,
  icon,
  onClose,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border-2 border-[#0066FF] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0066FF] text-white">
              {icon}
            </span>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-11 w-full rounded-xl bg-[#0066FF] text-sm font-bold text-white hover:bg-[#0057D9]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
