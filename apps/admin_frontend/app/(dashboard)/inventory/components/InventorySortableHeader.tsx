"use client";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortConfig {
  field: string;
  order: "asc" | "desc";
}

export const SortIcon: React.FC<{ field: string; sortConfig?: SortConfig }> = ({
  field,
  sortConfig,
}) => {
  if (sortConfig?.field !== field)
    return <ArrowUpDown size={13} className="text-gray-400" />;
  return sortConfig.order === "asc" ? (
    <ArrowUp size={13} className="text-[rgb(33,76,123)]" />
  ) : (
    <ArrowDown size={13} className="text-[rgb(33,76,123)]" />
  );
};

export const SortableHeader: React.FC<{
  field: string;
  label: string;
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
}> = ({ field, label, sortConfig, onSort }) => (
  <button
    type="button"
    onClick={() => onSort?.(field)}
    className="flex items-center gap-1 hover:text-[rgb(33,76,123)] transition-colors"
  >
    {label}
    <SortIcon field={field} sortConfig={sortConfig} />
  </button>
);

export type { SortConfig };
