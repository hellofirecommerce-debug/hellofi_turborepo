"use client";
import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; dir: "asc" | "desc" } | null;
  onSort: (key: string) => void;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
}) => {
  const isActive = currentSort?.key === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors group"
    >
      {label}
      <span
        className={`transition-colors ${isActive ? "text-[rgb(33,76,123)]" : "text-gray-300 group-hover:text-gray-400"}`}
      >
        {isActive ? (
          currentSort?.dir === "asc" ? (
            <ArrowUp size={13} />
          ) : (
            <ArrowDown size={13} />
          )
        ) : (
          <ArrowUpDown size={13} />
        )}
      </span>
    </button>
  );
};
