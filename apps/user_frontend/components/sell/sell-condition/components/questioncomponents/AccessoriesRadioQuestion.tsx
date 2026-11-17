"use client";
import { Check } from "lucide-react";

interface Props {
  condition: any;
  selectedId?: string;
  onSelect: (conditionId: string, option: any, isMulti: boolean) => void;
}

export function AccessoriesRadioQuestion({
  condition,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4">
      <p className="text-sm font-bold text-gray-900">{condition.title}</p>
      {condition.subtitle && (
        <p className="mt-1 text-[11px] text-gray-500">{condition.subtitle}</p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {condition.options.map((opt: any) => {
          const active = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(condition.id, opt, false)}
              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors ${
                active
                  ? "border-[#0066FF] bg-[#0066FF] text-white"
                  : "border-gray-200 text-gray-700 hover:border-[#0066FF]/50"
              }`}
            >
              {opt.label}
              {active && <Check size={14} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
