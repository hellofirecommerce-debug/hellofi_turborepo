"use client";
import { ChevronDown } from "lucide-react";

export function DynamicDropdown({ condition, selectedIds, onSelect }: any) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4">
      <p className="text-sm font-bold text-gray-900">{condition.title}</p>

      <div className="relative mt-3 w-full">
        <select
          value={selectedIds[0] || ""}
          onChange={(e) => {
            const selected = condition.options.find(
              (o: any) => o.id === e.target.value,
            );
            if (selected) onSelect(selected);
          }}
          className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
        >
          <option value="" disabled>
            Choose an option
          </option>
          {condition.options.map((opt: any) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
}
