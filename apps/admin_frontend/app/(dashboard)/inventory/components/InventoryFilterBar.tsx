"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, X, Filter, Calendar } from "lucide-react";
import { Input, Button, Label } from "@repo/ui";
import { useQuery } from "@apollo/client/react";
import { GET_BRANDS } from "../../../../lib/graphql/queries/brand.queries";
import { GET_CATEGORIES } from "../../../../lib/graphql/queries/category.queries";
import { InventoryFilter } from "../types";

interface Brand {
  id: string;
  name: string;
}
interface Category {
  id: string;
  name: string;
}

interface InventoryFilterBarProps {
  filter: InventoryFilter;
  onChange: (key: keyof InventoryFilter, value: any) => void;
  onReset: () => void;
}

export const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({
  filter,
  onChange,
  onReset,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const { data: brandsData } = useQuery<{ getBrands: Brand[] }>(GET_BRANDS);
  const { data: categoriesData } = useQuery<{ getCategories: Category[] }>(
    GET_CATEGORIES,
  );

  const brands = brandsData?.getBrands ?? [];
  const categories = categoriesData?.getCategories ?? [];

  const hasActiveFilters = !!(
    filter.status ||
    filter.brandId ||
    filter.categoryId ||
    filter.dateFrom ||
    filter.dateTo
  );
  const hasDateFilter = !!(filter.dateFrom || filter.dateTo);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (val?: string) =>
    val
      ? new Date(val).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const dateLabel = () => {
    if (filter.dateFrom && filter.dateTo)
      return `${formatDate(filter.dateFrom)} — ${formatDate(filter.dateTo)}`;
    if (filter.dateFrom) return `From ${formatDate(filter.dateFrom)}`;
    if (filter.dateTo) return `Until ${formatDate(filter.dateTo)}`;
    return "Date Range";
  };

  const clearDates = () => {
    onChange("dateFrom", undefined);
    onChange("dateTo", undefined);
    setShowDatePicker(false);
  };

  const handleQuickSelect = (type: string) => {
    const today = new Date();
    const toStr = today.toISOString().split("T")[0] ?? "";
    switch (type) {
      case "today":
        onChange("dateFrom", toStr);
        onChange("dateTo", toStr);
        break;
      case "yesterday": {
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        const yStr = y.toISOString().split("T")[0] ?? "";
        onChange("dateFrom", yStr);
        onChange("dateTo", yStr);
        break;
      }
      case "last7": {
        const f = new Date(today);
        f.setDate(today.getDate() - 7);
        onChange("dateFrom", f.toISOString().split("T")[0] ?? "");
        onChange("dateTo", toStr);
        break;
      }
      case "last30": {
        const f = new Date(today);
        f.setDate(today.getDate() - 30);
        onChange("dateFrom", f.toISOString().split("T")[0] ?? "");
        onChange("dateTo", toStr);
        break;
      }
      case "thisMonth": {
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        onChange("dateFrom", first.toISOString().split("T")[0] ?? "");
        onChange("dateTo", toStr);
        break;
      }
      case "lastMonth": {
        const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const last = new Date(today.getFullYear(), today.getMonth(), 0);
        onChange("dateFrom", first.toISOString().split("T")[0] ?? "");
        onChange("dateTo", last.toISOString().split("T")[0] ?? "");
        break;
      }
    }
    setShowDatePicker(false);
  };

  const quickOptions = [
    { label: "Today", type: "today" },
    { label: "Yesterday", type: "yesterday" },
    { label: "Last 7 days", type: "last7" },
    { label: "Last 30 days", type: "last30" },
    { label: "This month", type: "thisMonth" },
    { label: "Last month", type: "lastMonth" },
  ];

  const dateTypeOptions = [
    { value: "all", label: "Both" },
    { value: "purchase", label: "Purchase" },
    { value: "selling", label: "Selling" },
  ] as const;

  const selectClass =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

  return (
    <div className="flex flex-col gap-3">
      {/* Single row on desktop, two rows on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            value={filter.search ?? ""}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search by IMEI, order ID, product, customer..."
            className="pl-9 w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Reset */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="md"
              onClick={onReset}
              className="gap-1.5 text-red-500 border border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <X size={14} />
              Reset
            </Button>
          )}

          {/* Date range picker */}
          <div className="relative" ref={datePickerRef}>
            <Button
              variant={hasDateFilter ? "default" : "outline"}
              size="md"
              onClick={() => setShowDatePicker((p) => !p)}
              className="gap-2"
            >
              <Calendar size={15} />
              <span className="hidden lg:inline max-w-[180px] truncate">
                {dateLabel()}
              </span>
              <span className="lg:hidden">Date</span>
              {hasDateFilter && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDates();
                  }}
                  className="ml-1 hover:opacity-70 transition-opacity"
                >
                  <X size={13} />
                </span>
              )}
            </Button>

            {/* Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full mt-2 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-[290px]">
                {/* Date type */}
                <div className="flex flex-col gap-2 mb-4">
                  <Label>Date Type</Label>
                  <div className="flex items-center gap-1">
                    {dateTypeOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        size="md"
                        variant={
                          (filter.dateType ?? "all") === opt.value
                            ? "default"
                            : "outline"
                        }
                        onClick={() => onChange("dateType", opt.value)}
                        className="flex-1 text-xs"
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* From */}
                <div className="flex flex-col gap-1.5 mb-3">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={filter.dateFrom ?? ""}
                    onChange={(e) =>
                      onChange("dateFrom", e.target.value || undefined)
                    }
                  />
                </div>

                {/* To */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    value={filter.dateTo ?? ""}
                    onChange={(e) =>
                      onChange("dateTo", e.target.value || undefined)
                    }
                  />
                </div>

                {/* Quick selects */}
                <div className="flex flex-col gap-1">
                  <Label>Quick Select</Label>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {quickOptions.map((opt) => (
                      <Button
                        key={opt.type}
                        variant="ghost"
                        size="md"
                        onClick={() => handleQuickSelect(opt.type)}
                        className="justify-start text-gray-600 hover:bg-gray-50 font-normal"
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                {hasDateFilter && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={clearDates}
                    className="w-full mt-3 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-500"
                  >
                    Clear Dates
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Filter button */}
          <Button
            variant={showFilters ? "default" : "outline"}
            size="md"
            onClick={() => setShowFilters((p) => !p)}
            className="gap-2"
          >
            <Filter size={15} />
            Filter
            {(filter.status || filter.brandId || filter.categoryId) && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <select
              value={filter.status ?? ""}
              onChange={(e) => onChange("status", e.target.value || undefined)}
              className={selectClass}
              title="Select status"
            >
              <option value="">All Status</option>
              <option value="NOT_LISTED">Not Listed</option>
              <option value="LISTED">Listed</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Brand</Label>
            <select
              value={filter.brandId ?? ""}
              onChange={(e) => onChange("brandId", e.target.value || undefined)}
              className={selectClass}
              title="Select brand"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <select
              value={filter.categoryId ?? ""}
              onChange={(e) =>
                onChange("categoryId", e.target.value || undefined)
              }
              className={selectClass}
              title="Select category"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
