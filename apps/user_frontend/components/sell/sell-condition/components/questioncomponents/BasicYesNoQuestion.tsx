"use client";

interface Props {
  condition: any;
  selectedId?: string;
  onSelect: (conditionId: string, option: any, isMulti: boolean) => void;
}

export function BasicYesNoQuestion({ condition, selectedId, onSelect }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-bold text-gray-900">{condition.title}</p>
      {condition.subtitle && (
        <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
          {condition.subtitle}
        </p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-4 px-2">
        {condition.options.map((opt: any) => {
          const active = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(condition.id, opt, false)}
              className={`h-11 rounded-lg border text-sm font-semibold transition-colors ${
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
