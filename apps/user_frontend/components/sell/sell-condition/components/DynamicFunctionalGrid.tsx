"use client";
import { Check } from "lucide-react";
import * as LucideIcons from "lucide-react";

export function DynamicFunctionalGrid({
  condition,
  selectedIds,
  onSelect,
}: any) {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold text-gray-900">{condition.title}</h3>
      <p className="text-sm text-gray-500">{condition.subtitle}</p>

      {/* 👇 Changed grid columns to make cards wider */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {condition.options.map((opt: any) => {
          const active = selectedIds.includes(opt.id);
          const Icon =
            (LucideIcons as any)[opt.label.replace(/\s/g, "")] ||
            LucideIcons.Smartphone;

          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              // 👇 Removed aspect-square, added fixed height (h-40) and centered content
              className={`relative flex h-40 flex-col items-center justify-center gap-3 rounded-xl border p-4 text-center transition-all ${
                active
                  ? "border-[#0066FF] bg-[#EEF3FF] shadow-sm"
                  : "border-gray-200 bg-white hover:border-[#0066FF]/50"
              }`}
            >
              {active && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#0066FF] text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}

              {/* 👇 Adjusted image size so it fits perfectly */}
              {opt.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${opt.image}`}
                  alt={opt.label}
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <Icon
                  size={32}
                  strokeWidth={1.5}
                  className={active ? "text-[#0066FF]" : "text-gray-600"}
                />
              )}

              {/* 👇 Text styling adjusted */}
              <span
                className={`text-xs font-semibold leading-tight ${active ? "text-[#0066FF]" : "text-gray-800"}`}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
