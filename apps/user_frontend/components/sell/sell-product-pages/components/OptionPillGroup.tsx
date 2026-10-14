import { Check } from "lucide-react";

interface Props {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  variant?: "radio" | "check";
}

export function OptionPillGroup({
  label,
  options,
  selected,
  onSelect,
  variant = "check",
}: Props) {
  if (options.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-bold text-gray-500 capitalize tracking-wide mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`relative flex items-center gap-2 px-4 h-10 rounded-4xl border text-sm font-bold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[#0066FF] bg-blue-50 text-[#0066FF] shadow-sm"
                  : "border-variant-selected-border bg-variant-selected-bg text-sell-blue hover:border-[#0066FF] hover:text-[#0066FF]"
              }`}
            >
              {variant === "radio" && (
                <span
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-[#0066FF]" : "border-sell-blue/50"
                  }`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                  )}
                </span>
              )}
              {option}
              {variant === "check" && isSelected && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#0066FF]">
                  <Check size={10} className="text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
