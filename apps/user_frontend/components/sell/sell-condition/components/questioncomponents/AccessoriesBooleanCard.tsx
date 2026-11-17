"use client";
import { Box, Check } from "lucide-react";
import { iconFor } from "./accessoryIcons";

interface Props {
  condition: any;
  selectedId?: string;
  onSelect: (conditionId: string, option: any, isMulti: boolean) => void;
}

const find = (c: any, label: string) =>
  c.options.find((o: any) => String(o.label).trim().toLowerCase() === label);

export function AccessoriesBooleanCard({
  condition,
  selectedId,
  onSelect,
}: Props) {
  const Icon = iconFor(condition.title, Box);
  const yes = find(condition, "yes");
  const no = find(condition, "no");
  const isActive = !!yes && selectedId === yes.id;

  return (
    <button
      type="button"
      onClick={() => {
        // click toggles Yes <-> No
        if (isActive && no) onSelect(condition.id, no, false);
        else if (yes) onSelect(condition.id, yes, false);
      }}
      className={`relative flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
        isActive
          ? "border-[#0066FF] bg-[#EEF3FF]"
          : "border-blue-100 bg-white hover:border-[#0066FF]/50"
      }`}
    >
      {isActive && (
        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#0066FF] text-white">
          <Check size={10} strokeWidth={3} />
        </span>
      )}
      <Icon
        size={24}
        className={isActive ? "text-[#0066FF]" : "text-gray-600"}
        strokeWidth={1.5}
      />
      <p className="mt-2 text-xs font-bold text-gray-900">{condition.title}</p>
      {condition.subtitle && (
        <p className="mt-1 text-[10px] leading-tight text-gray-500">
          {condition.subtitle}
        </p>
      )}
    </button>
  );
}
