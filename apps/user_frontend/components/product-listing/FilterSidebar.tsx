// components/product-listing/FilterSidebar.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { AvailableFilters } from "../../lib/data/buyingProduct.data";

interface Props {
  filters: AvailableFilters;
}

function useUpdateParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(",").filter(Boolean) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (updated.length > 0) {
      params.set(key, updated.join(","));
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };
}

function useActiveValues(key: string): string[] {
  const searchParams = useSearchParams();
  return searchParams.get(key)?.split(",").filter(Boolean) ?? [];
}

function CheckboxGroup({
  paramKey,
  options,
}: {
  paramKey: string;
  options: { label: string; value: string }[];
}) {
  const toggle = useUpdateParam();
  const active = useActiveValues(paramKey);

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={active.includes(opt.value)}
            onChange={() => toggle(paramKey, opt.value)}
            className="w-4 h-4 accent-primary shrink-0 cursor-pointer"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function FilterSection({
  title,
  children,
  maxHeight = 180,
}: {
  title: string;
  children: React.ReactNode;
  maxHeight?: number;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col gap-3 pb-5 border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <p className="text-sm font-bold text-black">{title}</p>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="overflow-y-auto overflow-x-hidden pr-1 thin-scrollbar"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function PriceRangeSlider({ min, max }: { min: number; max: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackRef = useRef<HTMLDivElement>(null);

  const [localMin, setLocalMin] = useState(
    Number(searchParams.get("price_min")) || min,
  );
  const [localMax, setLocalMax] = useState(
    Number(searchParams.get("price_max")) || max,
  );
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const commit = useCallback(
    (newMin: number, newMax: number) => {
      const params = new URLSearchParams(searchParams.toString());
      newMin > min
        ? params.set("price_min", String(newMin))
        : params.delete("price_min");
      newMax < max
        ? params.set("price_max", String(newMax))
        : params.delete("price_max");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, min, max],
  );

  const posFromValue = (v: number) => ((v - min) / (max - min)) * 100;

  const valueFromClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return Math.round(min + pct * (max - min));
    },
    [min, max],
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
      const val = valueFromClientX(clientX);

      if (dragging === "min") {
        setLocalMin((prev) => Math.min(val, localMax - 1));
      } else {
        setLocalMax((prev) => Math.max(val, localMin + 1));
      }
    };

    const handleUp = () => {
      setDragging(null);
      commit(localMin, localMax);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragging, localMin, localMax, valueFromClientX, commit]);

  const handleInputChange = (which: "min" | "max", raw: string) => {
    const val = Number(raw.replace(/\D/g, "")) || 0;
    if (which === "min") {
      const clamped = Math.min(val, localMax - 1);
      setLocalMin(clamped);
      commit(clamped, localMax);
    } else {
      const clamped = Math.max(val, localMin + 1);
      setLocalMax(clamped);
      commit(localMin, clamped);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-2.5">
      <div
        ref={trackRef}
        className="relative h-1.5 rounded-full bg-gray-200 mt-4"
      >
        <div
          className="absolute h-1.5 rounded-full bg-primary"
          style={{
            left: `${posFromValue(localMin)}%`,
            right: `${100 - posFromValue(localMax)}%`,
          }}
        />
        <div
          onMouseDown={() => setDragging("min")}
          onTouchStart={() => setDragging("min")}
          className="absolute top-1/2 w-5 h-5 rounded-full bg-primary border-2 border-white shadow cursor-pointer -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${posFromValue(localMin)}%` }}
        />
        <div
          onMouseDown={() => setDragging("max")}
          onTouchStart={() => setDragging("max")}
          className="absolute top-1/2 w-5 h-5 rounded-full bg-primary border-2 border-white shadow cursor-pointer -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${posFromValue(localMax)}%` }}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          value={localMin}
          onChange={(e) => handleInputChange("min", e.target.value)}
          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg text-center"
        />
        <input
          type="text"
          inputMode="numeric"
          value={localMax}
          onChange={(e) => handleInputChange("max", e.target.value)}
          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg text-center"
        />
      </div>
    </div>
  );
}

export function FilterSidebar({ filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const resetFilters = () => {
    router.push(pathname);
  };

  return (
    <aside className="hidden sm:flex flex-col sticky top-24 max-h-[calc(100vh-7rem)] h-fit w-full bg-white border border-card-border rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
        <p className="text-base font-bold text-black">Filter Results</p>
        <button
          onClick={resetFilters}
          className="text-sm text-primary font-medium cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-y-auto overflow-x-hidden pl-5 pr-0 py-4 flex flex-col gap-1 thin-scrollbar">
        {filters.brands.length > 0 && (
          <FilterSection title="Brand" maxHeight={200}>
            <CheckboxGroup
              paramKey="brand"
              options={filters.brands.map((b) => ({
                label: b.name,
                value: b.name.toLowerCase(),
              }))}
            />
          </FilterSection>
        )}

        {filters.priceRange.min !== null && filters.priceRange.max !== null && (
          <FilterSection title="Price Range" maxHeight={220}>
            <PriceRangeSlider
              min={filters.priceRange.min}
              max={filters.priceRange.max}
            />
          </FilterSection>
        )}

        {filters.storages.length > 0 && (
          <FilterSection title="Storage" maxHeight={180}>
            <CheckboxGroup
              paramKey="storage"
              options={filters.storages.map((s) => ({ label: s, value: s }))}
            />
          </FilterSection>
        )}

        {filters.rams.length > 0 && (
          <FilterSection title="RAM" maxHeight={180}>
            <CheckboxGroup
              paramKey="ram"
              options={filters.rams.map((r) => ({ label: r, value: r }))}
            />
          </FilterSection>
        )}

        {filters.batteryCapacities.length > 0 && (
          <FilterSection title="Battery" maxHeight={180}>
            <CheckboxGroup
              paramKey="battery"
              options={filters.batteryCapacities.map((b) => ({
                label: b,
                value: b,
              }))}
            />
          </FilterSection>
        )}

        {filters.screenSizes.length > 0 && (
          <FilterSection title="Screen Size" maxHeight={180}>
            <CheckboxGroup
              paramKey="screenSize"
              options={filters.screenSizes.map((s) => ({
                label: s,
                value: s,
              }))}
            />
          </FilterSection>
        )}

        {filters.warrantyTypes.length > 0 && (
          <FilterSection title="Warranty" maxHeight={180}>
            <CheckboxGroup
              paramKey="warranty"
              options={filters.warrantyTypes.map((w) => ({
                label: w.replace(/_/g, " "),
                value: w,
              }))}
            />
          </FilterSection>
        )}
      </div>
    </aside>
  );
}
