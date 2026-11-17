"use client";
import { CheckCircle2 } from "lucide-react";

export function DynamicYesNoCard({ condition, selectedIds, onSelect }: any) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4">
      <p className="text-sm font-bold text-gray-900">{condition.title}</p>
      {condition.subtitle && (
        <p className="mt-1 text-xs text-gray-500">{condition.subtitle}</p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-3">
        {condition.options.map((opt: any) => {
          const active = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className={`h-10 rounded-lg border text-sm font-semibold transition-colors ${
                active
                  ? "border-[#0066FF] bg-[#0066FF] text-white"
                  : "border-gray-200 bg-white text-gray-800 hover:border-[#0066FF]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
