// components/sell/sell-product-pages/components/StepperHeader.tsx
"use client";

const STEPS = [
  "Select Brand & Model",
  "Select Variant",
  "Device Condition",
  "Get Your Price",
];

interface Props {
  currentStep: number; // 1-indexed
}

export function StepperHeader({ currentStep }: Props) {
  return (
    <div className="border-b border-gray-100 bg-white w-full">
      {/* Removed max-w-7xl and reduced horizontal padding to allow full-width on mobile */}
      <div className="w-full px-2 sm:px-4 py-4">
        {/* Mobile: Full width grid, evenly spaced */}
        <div className="grid grid-cols-4 gap-x-0 sm:hidden w-full">
          {STEPS.map((label, i) => {
            const step = i + 1;
            const isDone = step < currentStep;
            const isActive = step === currentStep;
            return (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 w-full"
              >
                {/* Icon Circle */}
                <div
                  className={`flex items-center justify-center rounded-full font-bold text-[11px] w-6 h-6 flex-shrink-0 ${
                    isDone || isActive
                      ? "bg-[#0066FF] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? "✓" : step}
                </div>
                {/* Text Label */}
                <span
                  className={`text-center text-[9px] leading-[1.2] line-clamp-2 w-full break-words px-0.5 ${
                    isActive
                      ? "text-[#0066FF] font-semibold"
                      : isDone
                        ? "text-gray-700"
                        : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Desktop / Tablet: Row with connecting lines, still limited to max-w-7xl */}
        <div className="hidden sm:flex items-center justify-center gap-4 max-w-7xl mx-auto">
          {STEPS.map((label, i) => {
            const step = i + 1;
            const isDone = step < currentStep;
            const isActive = step === currentStep;
            return (
              <div key={label} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1 min-w-[84px]">
                  <div
                    className={`flex items-center justify-center rounded-full font-bold text-sm w-8 h-8 ${
                      isDone || isActive
                        ? "bg-[#0066FF] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : step}
                  </div>
                  <span
                    className={`text-center text-xs leading-tight ${
                      isActive
                        ? "text-[#0066FF] font-semibold"
                        : isDone
                          ? "text-gray-700"
                          : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {step !== STEPS.length && (
                  <div
                    className={`h-[2px] w-10 mx-2 flex-shrink-0 ${
                      isDone ? "bg-[#0066FF]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
