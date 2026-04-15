"use client";
import React, { useState } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Button, Input } from "@repo/ui";

export interface FilterConfig {
  key: string;
  label: string;
  type: "search" | "select" | "date" | "daterange" | "multiselect";
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface TableFilterProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
  searchPlaceholder?: string;
  searchKey?: string;
}

export const TableFilter: React.FC<TableFilterProps> = ({
  filters,
  values,
  onChange,
  onReset,
  searchPlaceholder = "Search...",
  searchKey = "search",
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [openSelect, setOpenSelect] = useState<string | null>(null);

  const otherFilters = filters.filter(
    (f) => !(f.type === "search" && f.key === searchKey),
  );

  const hasActiveFilters = otherFilters.some((f) => {
    const v = values[f.key];
    return v && (Array.isArray(v) ? v.length > 0 : v !== "");
  });

  const activeFilterCount = otherFilters.filter((f) => {
    const v = values[f.key];
    return v && (Array.isArray(v) ? v.length > 0 : v !== "");
  }).length;

  const toggleMultiSelect = (key: string, value: string) => {
    const current: string[] = values[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange(key, updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            type="text"
            value={values[searchKey] || ""}
            onChange={(e) => onChange(searchKey, e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>

        {otherFilters.length > 0 && (
          <Button
            variant={showFilters || hasActiveFilters ? "default" : "outline"}
            size="md"
            onClick={() => setShowFilters((p) => !p)}
            className="gap-2"
          >
            <Filter size={15} />
            Filter
            {hasActiveFilters && (
              <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-red-500 border border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <X size={14} />
            Reset
          </Button>
        )}
      </div>

      {showFilters && otherFilters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {otherFilters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {filter.label}
              </label>

              {filter.type === "select" && (
                <select
                  title="filter-select"
                  value={values[filter.key] || ""}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(33,76,123)]/20 text-gray-700"
                >
                  <option value="">
                    {filter.placeholder || `All ${filter.label}`}
                  </option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === "multiselect" && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOpenSelect(
                        openSelect === filter.key ? null : filter.key,
                      )
                    }
                    className="w-full justify-between font-normal h-9"
                  >
                    <span
                      className={
                        values[filter.key]?.length
                          ? "text-gray-700"
                          : "text-gray-400"
                      }
                    >
                      {values[filter.key]?.length
                        ? `${values[filter.key].length} selected`
                        : filter.placeholder || `Select ${filter.label}`}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </Button>
                  {openSelect === filter.key && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filter.options?.map((opt) => {
                        const selected = (values[filter.key] || []).includes(
                          opt.value,
                        );
                        return (
                          <label
                            key={opt.value}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                toggleMultiSelect(filter.key, opt.value)
                              }
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                              {opt.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {filter.type === "date" && (
                <Input
                  type="date"
                  value={values[filter.key] || ""}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                />
              )}

              {filter.type === "daterange" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={values[`${filter.key}_from`] || ""}
                    onChange={(e) =>
                      onChange(`${filter.key}_from`, e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-gray-400 text-xs">to</span>
                  <Input
                    type="date"
                    value={values[`${filter.key}_to`] || ""}
                    onChange={(e) =>
                      onChange(`${filter.key}_to`, e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
