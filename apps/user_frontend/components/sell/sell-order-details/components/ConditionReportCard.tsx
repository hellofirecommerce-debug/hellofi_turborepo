"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import type { OrderAnswer } from "../types";

const PREVIEW_COUNT = 4;

export function ConditionReportCard({ answers }: { answers: OrderAnswer[] }) {
  const [expanded, setExpanded] = useState(false);

  if (answers.length === 0) return null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Condition Report</h2>
        {answers.length > PREVIEW_COUNT && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] font-bold text-[#0066FF] hover:underline"
          >
            {expanded ? "HIDE REPORT" : "VIEW REPORT →"}
          </button>
        )}
      </div>

      {expanded ? (
        <ul className="mt-3 flex flex-col divide-y divide-gray-100">
          {answers.map((a) => (
            <li
              key={a.conditionId}
              className="flex items-start justify-between gap-4 py-2 text-xs"
            >
              <span className="font-semibold text-gray-700">{a.question}</span>
              <span className="text-right font-bold text-[#0066FF]">
                {a.answer}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {answers.slice(0, PREVIEW_COUNT).map((a) => (
            <span
              key={a.conditionId}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-700"
            >
              <BadgeCheck size={12} className="shrink-0 text-[#0066FF]" />
              <span className="truncate">
                {a.question}: <b>{a.answer}</b>
              </span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
