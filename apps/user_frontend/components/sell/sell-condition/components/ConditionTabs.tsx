"use client";
import { useEffect, useRef } from "react";
import { Info, AlertTriangle, Smartphone, ClipboardList } from "lucide-react";
import { isStepComplete } from "./stepRules";

const ICONS: Record<string, any> = {
  BASICS: Info,
  DEVICE_DEFECTS: AlertTriangle,
  ACCESSORIES: Smartphone,
  COSMETIC_CONDITION: ClipboardList,
};

export function ConditionTabs({ steps, activeIndex, onChange, answers }: any) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // keep the current step visible when the tabs overflow (mobile)
  useEffect(() => {
    tabRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  // a tab opens only when every earlier step has its required answers
  const arePreviousStepsComplete = (index: number) => {
    for (let i = 0; i < index; i++) {
      if (!isStepComplete(steps[i], answers)) return false;
    }
    return true;
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map((step: any, index: number) => {
          const Icon = ICONS[step.stepCategory] || Info;
          const isActive = index === activeIndex;
          const isAccessible = arePreviousStepsComplete(index);

          return (
            <button
              key={step.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              onClick={() => isAccessible && onChange(index)}
              disabled={!isAccessible}
              className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-[#0066FF] text-[#0066FF]"
                  : isAccessible
                    ? "border-transparent text-gray-500 hover:text-gray-800"
                    : "border-transparent text-gray-300 cursor-not-allowed"
              }`}
            >
              <Icon size={15} />
              {step.stepName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
