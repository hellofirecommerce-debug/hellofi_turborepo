"use client";

interface Props {
  condition: any;
  selectedId?: string;
  onSelect: (conditionId: string, option: any, isMulti: boolean) => void;
}

export function BasicRadioQuestion({ condition, selectedId, onSelect }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-bold text-gray-900">{condition.title}</p>
      {condition.subtitle && (
        <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
          {condition.subtitle}
        </p>
      )}
      <div className="mt-3 flex flex-col gap-2">
        {condition.options.map((opt: any) => {
          const active = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(condition.id, opt, false)}
              className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                active
                  ? "border-[#0066FF] bg-[#0066FF] text-white"
                  : "border-gray-200 bg-white text-gray-900 hover:border-[#0066FF]"
              }`}
            >
              {opt.label}
              {active && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
