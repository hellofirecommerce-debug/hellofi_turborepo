"use client";
import { AccessoriesBooleanCard } from "./questioncomponents/AccessoriesBooleanCard";
import { AccessoriesDropdownCard } from "./questioncomponents/AccessoriesDropdownCard";
import { AccessoriesRadioQuestion } from "./questioncomponents/AccessoriesRadioQuestion";

interface Props {
  conditions: any[];
  answers: Record<string, string[]>;
  onSelect: (conditionId: string, option: any, isMulti: boolean) => void;
}

export function AccessoriesStep({ conditions, answers, onSelect }: Props) {
  // everything is driven by conditionType from the DB
  const booleans = conditions.filter((c) => c.conditionType === "BOOLEAN");
  const dropdowns = conditions.filter((c) => c.conditionType === "DROPDOWN");
  const radios = conditions.filter((c) => c.conditionType === "RADIO");

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div>
        <p className="text-[11px] font-bold tracking-wider text-[#0066FF]">
          STEP 3 OF 3 · ACCESSORIES
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
          What do you have with your phone?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Having these increases your price. We verify these during the physical
          inspection.
        </p>
      </div>

      {/* BOOLEAN tiles */}
      {booleans.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {booleans.map((c) => (
            <AccessoriesBooleanCard
              key={c.id}
              condition={c}
              selectedId={answers[c.id]?.[0]}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* DROPDOWN tiles */}
      {dropdowns.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {dropdowns.map((c) => (
            <AccessoriesDropdownCard
              key={c.id}
              condition={c}
              selectedId={answers[c.id]?.[0]}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* RADIO cards (e.g. mobile age) */}
      {radios.map((c) => (
        <AccessoriesRadioQuestion
          key={c.id}
          condition={c}
          selectedId={answers[c.id]?.[0]}
          onSelect={onSelect}
        />
      ))}

      {/* NOTES TEXTAREA */}
      <textarea
        placeholder="Any Other information, Please write here"
        rows={3}
        className="w-full resize-none rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
      />
    </div>
  );
}
