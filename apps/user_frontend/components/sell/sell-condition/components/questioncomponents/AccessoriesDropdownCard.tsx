"use client";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { iconFor } from "./accessoryIcons";

interface Props {
  condition: any;
  selectedId?: string;
  onSelect: (conditionId: string, option: any, isMulti: boolean) => void;
}

export function AccessoriesDropdownCard({
  condition,
  selectedId,
  onSelect,
}: Props) {
  const Icon = iconFor(condition.title, ShieldCheck);

  return (
    <div className="flex flex-col items-center rounded-xl border border-blue-100 bg-white p-4 text-center">
      <Icon size={24} className="text-gray-600" strokeWidth={1.5} />
      <p className="mt-2 text-xs font-bold text-gray-900">{condition.title}</p>

      <div className="relative mt-3 w-full">
        <select
          value={selectedId || ""}
          onChange={(e) => {
            const opt = condition.options.find(
              (o: any) => o.id === e.target.value,
            );
            if (opt) onSelect(condition.id, opt, false);
          }}
          className="h-8 w-full appearance-none rounded-md bg-gray-100 px-2.5 pr-7 text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
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
          size={12}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
}
