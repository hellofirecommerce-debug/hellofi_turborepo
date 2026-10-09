// components/sell/sell-product-pages/components/StepperHeader.tsx
"use client";

import { motion } from "motion/react";

const STEPS = [
  "Select Brand & Model",
  "Select Variant",
  "Device Condition",
  "Get Your Price",
];

interface Props {
  currentStep: number;
}

export function StepperHeader({ currentStep }: Props) {
  // Per-step circle/line animation needs live `animate` props tied to
  // currentStep, not a scroll-triggered Reveal, so this stays on raw motion.
  return (
    <div className="border-b border-gray-100 bg-white w-full">
      <div className="w-full px-2 sm:px-4 py-4">
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
                <motion.div
                  layout
                  initial={false}
                  animate={{
                    scale: isActive ? 1.08 : 1,
                    backgroundColor: isDone || isActive ? "#0066FF" : "#F3F4F6",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={`flex items-center justify-center rounded-full font-bold text-[11px] w-6 h-6 flex-shrink-0 ${
                    isDone || isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {isDone ? "✓" : step}
                </motion.div>
                <span
                  className={`text-center text-[9px] leading-[1.2] line-clamp-2 w-full break-words px-0.5 transition-colors duration-300 ${
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

        <div className="hidden sm:flex items-center justify-center gap-4 max-w-7xl mx-auto">
          {STEPS.map((label, i) => {
            const step = i + 1;
            const isDone = step < currentStep;
            const isActive = step === currentStep;
            return (
              <div key={label} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center gap-1 min-w-[84px]">
                  <motion.div
                    layout
                    initial={false}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor:
                        isDone || isActive ? "#0066FF" : "#F3F4F6",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`flex items-center justify-center rounded-full font-bold text-sm w-8 h-8 ${
                      isDone || isActive ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : step}
                  </motion.div>
                  <span
                    className={`text-center text-xs leading-tight transition-colors duration-300 ${
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
                  <div className="relative h-[2px] w-10 mx-2 flex-shrink-0 bg-gray-200 overflow-hidden rounded-full">
                    <motion.div
                      initial={false}
                      animate={{ width: isDone ? "100%" : "0%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-[#0066FF] rounded-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
