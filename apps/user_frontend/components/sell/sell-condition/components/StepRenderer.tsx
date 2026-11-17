"use client";
import { DynamicDropdown } from "./DynamicDropdown";
import { DynamicFunctionalGrid } from "./DynamicFunctionalGrid";
import { AccessoriesBooleanCard } from "./questioncomponents/AccessoriesBooleanCard";
import { AccessoriesDropdownCard } from "./questioncomponents/AccessoriesDropdownCard";
import { AccessoriesRadioQuestion } from "./questioncomponents/AccessoriesRadioQuestion";
import { BasicYesNoQuestion } from "./questioncomponents/BasicYesNoQuestion";
import { BasicRadioQuestion } from "./questioncomponents/BasicRadioQuestion";
import { hasIcon } from "./questioncomponents/accessoryIcons";

interface Props {
  step: any;
  stepIndex: number;
  stepCount: number;
  answers: Record<string, string[]>;
  onSelect: (conditionId: string, option: any, isMulti: boolean) => void;
}

// BOOLEAN / DROPDOWN with an icon render as small tiles
const isTile = (c: any) =>
  (c.conditionType === "BOOLEAN" || c.conditionType === "DROPDOWN") &&
  hasIcon(c);

export function StepRenderer({
  step,
  stepIndex,
  stepCount,
  answers,
  onSelect,
}: Props) {
  const renderOne = (c: any) => {
    const selectedIds = answers[c.id] || [];
    const selectedId = selectedIds[0];

    switch (c.conditionType) {
      case "BOOLEAN":
        return isTile(c) ? (
          <AccessoriesBooleanCard
            key={c.id}
            condition={c}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ) : (
          <BasicYesNoQuestion
            key={c.id}
            condition={c}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        );

      case "DROPDOWN":
        return isTile(c) ? (
          <AccessoriesDropdownCard
            key={c.id}
            condition={c}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ) : (
          <DynamicDropdown
            key={c.id}
            condition={c}
            selectedIds={selectedIds}
            onSelect={(opt: any) => onSelect(c.id, opt, false)}
          />
        );

      case "RADIO": {
        // short labels -> grid cards, long labels -> stacked list
        const short = c.options.every((o: any) => String(o.label).length <= 16);
        const Radio = short ? AccessoriesRadioQuestion : BasicRadioQuestion;
        return (
          <Radio
            key={c.id}
            condition={c}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        );
      }

      case "MULTI_SELECT":
      case "MULTI_SELECT_INVERTED":
        return (
          <DynamicFunctionalGrid
            key={c.id}
            condition={c}
            selectedIds={selectedIds}
            onSelect={(opt: any) => onSelect(c.id, opt, true)}
          />
        );

      default:
        return null;
    }
  };

  // consecutive tiles share one grid row, everything else is full width
  const rows: ({ tiles: any[] } | { single: any })[] = [];
  for (const c of step.conditions) {
    if (isTile(c)) {
      const last = rows[rows.length - 1];
      if (last && "tiles" in last) last.tiles.push(c);
      else rows.push({ tiles: [c] });
    } else {
      rows.push({ single: c });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF]">
          Step {stepIndex + 1} of {stepCount} · {step.stepName}
        </p>
        {step.title && (
          <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
            {step.title}
          </h2>
        )}
        {step.subtitle && (
          <p className="mt-1 text-sm text-gray-500">{step.subtitle}</p>
        )}
      </div>

      {rows.map((row, i) =>
        "tiles" in row ? (
          <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {row.tiles.map(renderOne)}
          </div>
        ) : (
          renderOne(row.single)
        ),
      )}
    </div>
  );
}
