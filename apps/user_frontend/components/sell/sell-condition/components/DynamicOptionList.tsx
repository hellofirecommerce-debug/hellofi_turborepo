"use client";
import { CheckCircle2 } from "lucide-react";

export function DynamicOptionList({ condition, selectedIds, onSelect }: any) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4">
      <p className="text-sm font-bold text-gray-900">{condition.title}</p>
      <div className="mt-3 flex flex-col gap-2">
        {condition.options.map((opt: any) => {
          const active = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm font-semibold transition-colors ${
                active
                  ? "border-[#0066FF] bg-[#0066FF] text-white"
                  : "border-gray-200 bg-white text-gray-800 hover:border-[#0066FF]"
              }`}
            >
              {opt.label}
              {active && <CheckCircle2 size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
