// components/model-selection/SeriesFilter.tsx
"use client";

import type { Series } from "../../../lib/data/series.data";

interface Props {
  series: Series[];
  activeSeriesId: string | null;
  onSelect: (seriesId: string | null) => void;
}

export function SeriesFilter({ series, activeSeriesId, onSelect }: Props) {
  return (
    <>
      {/* Mobile — horizontal scrolling pills */}
      <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 w-max">
          <button
            onClick={() => onSelect(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeSeriesId === null
                ? "bg-[#0066FF] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            All
          </button>
          {series.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeSeriesId === s.id
                  ? "bg-[#0066FF] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {s.seriesName}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop — sticky vertical list */}
      <aside className="hidden lg:block h-full">
        <div className="sticky top-28 border border-gray-200 rounded-xl overflow-hidden h-[calc(100vh-8rem)] flex flex-col">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 shrink-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              iPhone Models
            </p>
          </div>
          <ul className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.300)_transparent]">
            <li>
              <button
                onClick={() => onSelect(null)}
                className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  activeSeriesId === null
                    ? "bg-blue-50 text-[#0066FF] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                All
              </button>
            </li>
            {series.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => onSelect(s.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    activeSeriesId === s.id
                      ? "bg-blue-50 text-[#0066FF] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {s.seriesName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
