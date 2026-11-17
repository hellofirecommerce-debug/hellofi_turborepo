import { CheckCircle2 } from "lucide-react";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  title: string;
  options: Option<T>[];
  value?: T;
  onChange: (v: T) => void;
}

export function OptionList<T extends string>({
  title,
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4">
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm font-semibold transition-colors ${
                active
                  ? "border-[#0066FF] bg-[#0066FF] text-white"
                  : "border-gray-200 bg-white text-gray-800 hover:border-[#0066FF]"
              }`}
            >
              {o.label}
              {active && <CheckCircle2 size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
