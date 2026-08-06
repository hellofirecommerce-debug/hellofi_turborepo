"use client";
import React, { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input, Button, Label } from "@repo/ui";
import { useQuery } from "@apollo/client/react";
import { useDebounce } from "use-debounce";
import { GET_BRANDS } from "../../../../../lib/graphql/queries/brand.queries";
import { GET_CATEGORIES } from "../../../../../lib/graphql/queries/category.queries";
import { BuyingProductFilter } from "../types";

const selectClass =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

interface Props {
  filter: BuyingProductFilter;
  onChange: (key: keyof BuyingProductFilter, value: any) => void;
  onReset: () => void;
}

// ── Encodes the mutually-exclusive placement fields as one value ──
type PlacementValue =
  | ""
  | "MOST_LOVED"
  | "PEOPLE_LOVE"
  | "TOP_SELLING"
  | "GAMING"
  | "MEGA_DHAMAKA"
  | "LUXE";

function getPlacementValue(filter: BuyingProductFilter): PlacementValue {
  if (filter.featuredSection === "MOST_LOVED") return "MOST_LOVED";
  if (filter.featuredSection === "PEOPLE_LOVE") return "PEOPLE_LOVE";
  if (filter.isTopSelling === true) return "TOP_SELLING";
  if (filter.isGaming === true) return "GAMING";
  if (filter.isMegaDhamaka === true) return "MEGA_DHAMAKA";
  if (filter.isLuxe === true) return "LUXE";
  return "";
}

export const BuyingProductFilterBar: React.FC<Props> = ({
  filter,
  onChange,
  onReset,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const [debouncedSearch] = useDebounce(searchInput, 500);

  const { data: categoriesData } = useQuery<{
    getCategories: { id: string; name: string }[];
  }>(GET_CATEGORIES);
  const { data: brandsData } = useQuery<{
    getBrands: {
      id: string;
      name: string;
      brandCategories: { categoryId: string }[];
    }[];
  }>(GET_BRANDS);

  const categories = categoriesData?.getCategories ?? [];
  const allBrands = brandsData?.getBrands ?? [];
  const brands = filter.categoryId
    ? allBrands.filter((b) =>
        b.brandCategories?.some((bc) => bc.categoryId === filter.categoryId),
      )
    : allBrands;

  const placementValue = getPlacementValue(filter);

  const hasActiveFilters = !!(
    filter.brandId ||
    filter.categoryId ||
    placementValue !== "" ||
    filter.availability !== undefined
  );

  useEffect(() => {
    onChange("search", debouncedSearch || undefined);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!filter.search) setSearchInput("");
  }, [filter.search]);

  const handleCategoryChange = (categoryId: string) => {
    onChange("categoryId", categoryId || undefined);
    onChange("brandId", undefined);
  };

  // ── Selecting one placement clears every other placement field ──
  const handlePlacementChange = (value: PlacementValue) => {
    onChange("featuredSection", undefined);
    onChange("isTopSelling", undefined);
    onChange("isGaming", undefined);
    onChange("isMegaDhamaka", undefined);
    onChange("isLuxe", undefined);

    if (value === "MOST_LOVED" || value === "PEOPLE_LOVE") {
      onChange("featuredSection", value);
    } else if (value === "TOP_SELLING") {
      onChange("isTopSelling", true);
    } else if (value === "GAMING") {
      onChange("isGaming", true);
    } else if (value === "MEGA_DHAMAKA") {
      onChange("isMegaDhamaka", true);
    } else if (value === "LUXE") {
      onChange("isLuxe", true);
    }
  };

  const handleReset = () => {
    setSearchInput("");
    onReset();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by product name or slug..."
            className="pl-9 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          {(hasActiveFilters || searchInput) && (
            <Button
              variant="ghost"
              size="md"
              onClick={handleReset}
              className="gap-1.5 text-red-500 border border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <X size={14} />
              Reset
            </Button>
          )}
          <Button
            variant={showFilters ? "default" : "outline"}
            size="md"
            onClick={() => setShowFilters((p) => !p)}
            className="gap-2"
          >
            <Filter size={15} />
            Filter
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <select
              title="category"
              value={filter.categoryId ?? ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={selectClass}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Brand</Label>
            <select
              title="brand"
              value={filter.brandId ?? ""}
              onChange={(e) => onChange("brandId", e.target.value || undefined)}
              disabled={!filter.categoryId}
              className={`${selectClass} ${!filter.categoryId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {!filter.categoryId ? "Select category first" : "All Brands"}
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Placement</Label>
            <select
              title="placement"
              value={placementValue}
              onChange={(e) =>
                handlePlacementChange(e.target.value as PlacementValue)
              }
              className={selectClass}
            >
              <option value="">All</option>
              <option value="MOST_LOVED">Most Loved This Week</option>
              <option value="PEOPLE_LOVE">Phones People Are Loving</option>
              <option value="TOP_SELLING">Top Selling</option>
              <option value="GAMING">Gaming</option>
              <option value="MEGA_DHAMAKA">Mega Dhamaka</option>
              <option value="LUXE">Luxe</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Stock</Label>
            <select
              title="stock"
              value={filter.availability ?? ""}
              onChange={(e) =>
                onChange(
                  "availability",
                  e.target.value === "" ? undefined : e.target.value,
                )
              }
              className={selectClass}
            >
              <option value="">All</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
