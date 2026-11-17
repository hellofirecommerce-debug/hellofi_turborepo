"use client";

interface Props {
  conditions: any[];
  answers: Record<string, string[]>;
  onSelect: (conditionId: string, option: any, isMulti: boolean) => void;
}

export function BasicsStep({ conditions, answers, onSelect }: Props) {
  // 1. Identify the conditions based on their titles in the DB
  const switchingOn = conditions.find((c) => c.title.includes("switching on"));
  const calls = conditions.find((c) => c.title.includes("receive calls"));
  const screen = conditions.find((c) => c.title.includes("screen genuine"));
  const repair = conditions.find((c) => c.title.includes("repaired"));

  return (
    <div className="flex flex-col gap-4">
      {/* 👇 ROW 1: Switching On & Calls (Side by side) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[switchingOn, calls].map((condition) => {
          if (!condition) return null;
          const selectedId = answers[condition.id]?.[0];
          return (
            <div
              key={condition.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="text-sm font-bold text-gray-900">
                {condition.title}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {condition.options.map((opt: any) => {
                  const active = selectedId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelect(condition.id, opt, false)}
                      className={`h-10 rounded-lg border text-sm font-semibold transition-colors ${
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
        })}
      </div>

      {/* 👇 ROW 2: Screen Genuine (Full width with subtitle) */}
      {screen && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-bold text-gray-900">{screen.title}</p>
          {screen.subtitle && (
            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
              {screen.subtitle}
            </p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-4 px-2">
            {screen.options.map((opt: any) => {
              const active = answers[screen.id]?.[0] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSelect(screen.id, opt, false)}
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
      )}

      {/* 👇 ROW 3: Ever Repaired (Stacked list with radio circles) */}
      {repair && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-bold text-gray-900">{repair.title}</p>
          <div className="mt-3 flex flex-col gap-2">
            {repair.options.map((opt: any) => {
              const active = answers[repair.id]?.[0] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSelect(repair.id, opt, false)}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    active
                      ? "border-[#0066FF] bg-[#0066FF] text-white"
                      : "border-gray-200 bg-white text-gray-800 hover:border-[#0066FF]"
                  }`}
                >
                  {opt.label}
                  {active && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
