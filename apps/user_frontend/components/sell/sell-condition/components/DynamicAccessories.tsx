"use client";
import { Check } from "lucide-react";

export function DynamicAccessories({ condition, selectedIds, onSelect }: any) {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold text-gray-900">{condition.title}</h3>
      <p className="mb-4 text-sm text-gray-500">{condition.subtitle}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {condition.options.map((opt: any) => {
          const active = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className={`relative flex flex-col items-center rounded-xl border p-6 text-center transition-all ${
                active
                  ? "border-[#0066FF] bg-[#EEF3FF]"
                  : "border-blue-100 bg-white hover:border-[#0066FF]/50"
              }`}
            >
              {active && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#0066FF] text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}

              {/* Image or Icon */}
              {opt.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${opt.image}`}
                  alt={opt.label}
                  className="h-10 w-10 object-contain mb-3"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded-full mb-3" />
              )}

              <p className="text-sm font-bold text-gray-900">{opt.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
