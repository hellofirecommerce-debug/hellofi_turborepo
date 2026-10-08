"use client";

import { motion } from "motion/react";
import type { Series } from "../../../../lib/data/series.data";

interface Props {
  series: Series[];
  activeSeriesId: string | null;
  onSelect: (seriesId: string | null) => void;
}

const spring = { type: "spring", stiffness: 400, damping: 32 } as const;

function Pill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative shrink-0 px-4 py-2 rounded-full bg-gray-100 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors hover:bg-gray-200 active:scale-95"
    >
      {active && (
        <motion.span
          layoutId="series-pill-active"
          transition={spring}
          className="absolute inset-0 rounded-full bg-[#0066FF] shadow-md shadow-[#0066FF]/30"
        />
      )}
      <span
        className={`relative z-10 transition-colors ${
          active ? "text-white" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function Row({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50"
    >
      {active && (
        <>
          <motion.span
            layoutId="series-row-bg"
            transition={spring}
            className="absolute inset-0 bg-blue-50"
          />
          <motion.span
            layoutId="series-row-bar"
            transition={spring}
            className="absolute left-0 top-0 h-full w-1 bg-[#0066FF] rounded-r"
          />
        </>
      )}
      <span
        className={`relative z-10 inline-block transition-all duration-200 ${
          active
            ? "text-[#0066FF] font-semibold translate-x-1"
            : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export function SeriesFilter({ series, activeSeriesId, onSelect }: Props) {
  return (
    <>
      {/* Mobile — horizontal scrolling pills */}
      <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide scroll-smooth">
        <div className="flex gap-2 pb-2 w-max">
          <Pill
            active={activeSeriesId === null}
            label="All"
            onClick={() => onSelect(null)}
          />
          {series.map((s) => (
            <Pill
              key={s.id}
              active={activeSeriesId === s.id}
              label={s.seriesName}
              onClick={() => onSelect(s.id)}
            />
          ))}
        </div>
      </div>

      {/* Desktop — sticky vertical list */}
      <aside className="hidden lg:block h-full">
        <div className="sticky top-28 border border-gray-200 rounded-2xl overflow-hidden h-[calc(100vh-8rem)] flex flex-col bg-white">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 shrink-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              iPhone Models
            </p>
          </div>
          <ul className="flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.300)_transparent]">
            <li>
              <Row
                active={activeSeriesId === null}
                label="All"
                onClick={() => onSelect(null)}
              />
            </li>
            {series.map((s) => (
              <li key={s.id}>
                <Row
                  active={activeSeriesId === s.id}
                  label={s.seriesName}
                  onClick={() => onSelect(s.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
