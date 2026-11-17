import { Check } from "lucide-react";
import { FUNCTIONAL_ISSUES } from "../constants";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export function FunctionalIssuesGrid({ selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {FUNCTIONAL_ISSUES.map(({ id, label, icon: Icon }) => {
        const active = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={`relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-[11px] font-medium transition-all ${
              active
                ? "border-[#0066FF] bg-[#EEF3FF] text-[#0066FF] shadow-sm"
                : "border-blue-100 bg-white text-gray-600 hover:border-[#0066FF]/50"
            }`}
          >
            {active && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0066FF] text-white">
                <Check size={10} strokeWidth={3} />
              </span>
            )}
            <Icon size={22} strokeWidth={1.6} />
            <span className="leading-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
