"use client";
import { DollarSign, ShieldCheck, Info } from "lucide-react";

export function EvaluationSummary({ answers, steps }: any) {
  return (
    <aside className="flex flex-col gap-3 lg:sticky lg:top-6">
      <div className="rounded-xl border border-blue-100 bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-gray-500">
              DEVICE EVALUATION
            </p>
            <p className="mt-1 text-base font-bold text-gray-900">
              Estimated Value
            </p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066FF] text-white">
            <DollarSign size={16} />
          </span>
        </div>

        <p className="mt-4 text-3xl font-extrabold text-[#0066FF]">₹ XX,XXX</p>

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#EEF3FF] px-3 py-2 text-xs font-medium text-[#0066FF]">
          <ShieldCheck size={14} />
          14-day price lock guarantee
        </div>

        <p className="mt-5 text-[11px] font-bold tracking-wider text-gray-900">
          YOUR ANSWERS
        </p>

        {/* 👇 LOOP THROUGH ALL STEPS AND CONDITIONS */}
        <div className="mt-3 flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
          {steps.map((step: any) => {
            const stepAnswers = step.conditions.filter(
              (c: any) => (answers[c.id] || []).length > 0,
            );

            if (stepAnswers.length === 0) return null; // Skip if no answers yet

            return (
              <div key={step.id} className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {step.stepName}
                </p>
                <ul className="flex flex-col gap-2 border-l-2 border-gray-100 pl-3">
                  {stepAnswers.map((condition: any) => {
                    const selectedOptionId = answers[condition.id][0];
                    const selectedOption = condition.options.find(
                      (o: any) => o.id === selectedOptionId,
                    );

                    return (
                      <li
                        key={condition.id}
                        className="flex flex-col text-xs leading-tight"
                      >
                        <span className="text-gray-600">{condition.title}</span>
                        <span className="font-semibold text-[#0066FF] mt-0.5">
                          {selectedOption?.label || "Selected"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          {/* If absolutely nothing is selected yet */}
          {Object.values(answers).flat().length === 0 && (
            <p className="text-xs text-gray-400 italic">
              Start answering to see your summary.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-gray-100 px-4 py-3 text-xs text-gray-600">
        <Info size={14} className="mt-0.5 shrink-0" />
        Final price is subject to physical verification of the device condition
        at pickup.
      </div>
    </aside>
  );
}
