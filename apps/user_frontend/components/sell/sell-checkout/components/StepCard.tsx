"use client";

import type { ReactNode } from "react";
import { Check, ChevronDown, Lock } from "lucide-react";

interface Props {
  index: number;
  title: string;
  icon: ReactNode;
  state: "done" | "active" | "locked";
  open: boolean;
  onToggle?: () => void;
  summary?: ReactNode; // shown under the title when collapsed
  children?: ReactNode;
}

export default function StepCard({
  index,
  title,
  icon,
  state,
  open,
  onToggle,
  summary,
  children,
}: Props) {
  const locked = state === "locked";

  return (
    <section
      className={`rounded-xl border bg-white transition ${
        open && !locked ? "border-gray-800 shadow-sm" : "border-gray-300"
      } ${locked ? "opacity-70" : ""}`}
    >
      <button
        type="button"
        disabled={locked}
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            state === "done"
              ? "bg-[#10B981] text-white"
              : "bg-[#EEF3FF] text-[#0066FF]"
          }`}
        >
          {state === "done" ? <Check size={14} strokeWidth={3} /> : icon}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-gray-900">
            {index}. {title}
          </span>
          {!open && summary && (
            <span className="mt-0.5 block truncate text-xs text-gray-500">
              {summary}
            </span>
          )}
        </span>

        {locked ? (
          <Lock size={16} className="shrink-0 text-gray-400" />
        ) : (
          <ChevronDown
            size={18}
            className={`shrink-0 text-gray-500 transition ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && !locked && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-4">
          {children}
        </div>
      )}
    </section>
  );
}
