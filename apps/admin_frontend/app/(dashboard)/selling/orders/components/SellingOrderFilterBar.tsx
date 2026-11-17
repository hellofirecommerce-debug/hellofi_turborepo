"use client";
import React, { useEffect, useState } from "react";
import { CalendarDays, Search, X } from "lucide-react";
import { Button, Input } from "@repo/ui";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { OrderFilterState, TimelineStatusOption } from "../types";
import { DATE_FILTER_OPTIONS, MONTHS, dateFilterLabel } from "../helpers";

const selectClass =
  "w-full h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    {children}
  </div>
);

// search box: applies 500ms after you stop typing
const DebouncedSearch: React.FC<{
  value: string;
  onCommit: (v: string) => void;
  placeholder: string;
}> = ({ value, onCommit, placeholder }) => {
  const [text, setText] = useState(value);
  const [debounced] = useDebounce(text, 500);

  useEffect(() => {
    if (debounced !== value) onCommit(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="pl-9 w-full h-10"
      />
    </div>
  );
};

interface Props {
  value: OrderFilterState; // applied filter (lives in the page)
  cities: string[];
  statuses: TimelineStatusOption[];
  onChange: (patch: Partial<OrderFilterState>) => void;
  onClear: () => void;
}

export const SellingOrderFilterBar: React.FC<Props> = ({
  value,
  cities,
  statuses,
  onChange,
  onClear,
}) => {
  // date fields are held locally until they are complete, then applied
  const [date, setDate] = useState({
    dateFilter: value.dateFilter,
    year: value.year,
    month: value.month,
    startDate: value.startDate,
    endDate: value.endDate,
  });

  const updateDate = (patch: Partial<typeof date>) => {
    const next = { ...date, ...patch };
    setDate(next);

    // wait until the needed dates are filled in
    if (next.dateFilter === "DAY" && !next.startDate) return;
    if (next.dateFilter === "CUSTOM") {
      if (!next.startDate || !next.endDate) return;
      if (next.endDate < next.startDate) {
        toast.error("End date cannot be before start date");
        return;
      }
    }
    onChange(next);
  };

  const removeDateChip = () => {
    setDate((p) => ({ ...p, dateFilter: "ALL_TIME" }));
    onChange({ dateFilter: "ALL_TIME" });
  };

  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => thisYear - i);
  const chip = value.dateFilter !== "ALL_TIME" ? dateFilterLabel(value) : "";

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* row 1 */}
        <Field label="Order No">
          <DebouncedSearch
            value={value.orderNo}
            onCommit={(v) => onChange({ orderNo: v })}
            placeholder="Search by order no..."
          />
        </Field>
        <Field label="Product Name">
          <DebouncedSearch
            value={value.productName}
            onCommit={(v) => onChange({ productName: v })}
            placeholder="Search by product name..."
          />
        </Field>
        <Field label="Customer">
          <DebouncedSearch
            value={value.customer}
            onCommit={(v) => onChange({ customer: v })}
            placeholder="Name or number..."
          />
        </Field>
        <Field label="Status">
          <select
            title="status"
            value={value.timelineStatus}
            onChange={(e) => onChange({ timelineStatus: e.target.value })}
            className={selectClass}
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s.status} value={s.status}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        {/* row 2 */}
        <Field label="City">
          <select
            title="city"
            value={value.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={selectClass}
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pending Orders">
          <select
            title="fulfilment"
            value={value.fulfilment}
            onChange={(e) =>
              onChange({
                fulfilment: e.target.value as OrderFilterState["fulfilment"],
              })
            }
            className={selectClass}
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending Orders</option>
            <option value="FULFILLED">Fulfilled Orders</option>
          </select>
        </Field>
        <Field label="Date Filter">
          <select
            title="date filter"
            value={date.dateFilter}
            onChange={(e) =>
              updateDate({
                dateFilter: e.target.value as OrderFilterState["dateFilter"],
              })
            }
            className={selectClass}
          >
            {DATE_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        {/* date extras: same grid, right after Date Filter */}
        {date.dateFilter === "MONTH_YEAR" && (
          <Field label="Month">
            <select
              title="month"
              value={date.month}
              onChange={(e) => updateDate({ month: e.target.value })}
              className={selectClass}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
        )}

        {(date.dateFilter === "YEAR" || date.dateFilter === "MONTH_YEAR") && (
          <Field label="Year">
            <select
              title="year"
              value={date.year}
              onChange={(e) => updateDate({ year: e.target.value })}
              className={selectClass}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </Field>
        )}

        {date.dateFilter === "DAY" && (
          <Field label="Date">
            <input
              type="date"
              title="day"
              value={date.startDate}
              onChange={(e) => updateDate({ startDate: e.target.value })}
              className={selectClass}
            />
          </Field>
        )}

        {date.dateFilter === "CUSTOM" && (
          <>
            <Field label="Start Date">
              <input
                type="date"
                title="start date"
                value={date.startDate}
                onChange={(e) => updateDate({ startDate: e.target.value })}
                className={selectClass}
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                title="end date"
                value={date.endDate}
                min={date.startDate || undefined}
                onChange={(e) => updateDate({ endDate: e.target.value })}
                className={selectClass}
              />
            </Field>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-h-8">
          {chip && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(33,76,123)] px-3 py-1 text-xs font-medium text-[rgb(33,76,123)]">
              <CalendarDays size={13} />
              {chip}
              <button
                type="button"
                onClick={removeDateChip}
                aria-label="Remove date filter"
                className="rounded-full hover:bg-blue-50"
              >
                <X size={13} />
              </button>
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onClear}
          className="h-9 px-4 text-sm"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
