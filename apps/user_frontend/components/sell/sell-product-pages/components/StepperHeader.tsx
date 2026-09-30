interface Step {
  label: string;
}

const STEPS: Step[] = [
  { label: "Select Brand & Model" },
  { label: "Select Variant" },
  { label: "Device Condition" },
  { label: "Get Your Price" },
];

interface Props {
  currentStep: number; // 1-based
}

export function StepperHeader({ currentStep }: Props) {
  return (
    <div className="w-full bg-white border-b border-gray-100 py-5">
      <div className="max-w-5xl mx-auto px-4 flex items-center">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={step.label}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    isDone || isActive
                      ? "bg-[#0066FF] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isDone ? "✓" : stepNumber}
                </span>
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    isActive
                      ? "text-[#0066FF]"
                      : isDone
                        ? "text-gray-700"
                        : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {stepNumber !== STEPS.length && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-5 ${
                    isDone ? "bg-[#0066FF]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
