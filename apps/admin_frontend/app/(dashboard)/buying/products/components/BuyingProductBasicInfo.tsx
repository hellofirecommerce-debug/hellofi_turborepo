"use client";
import React from "react";
import { Input, Label } from "@repo/ui";
import { CreateBuyingProductInput } from "@repo/validations";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

interface Props {
  form: CreateBuyingProductInput;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  onNameChange: (value: string) => void;
  onChange: (key: keyof CreateBuyingProductInput, value: any) => void;
}

export const BuyingProductBasicInfo: React.FC<Props> = ({
  form,
  categories,
  brands,
  onNameChange,
  onChange,
}) => {
  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const isOtherAccessories = selectedCategory?.name
    ?.toLowerCase()
    .includes("accessories");
  const isLaptopCategory = selectedCategory?.name
    ?.toLowerCase()
    .includes("laptop");
  const isMobileCategory = selectedCategory?.name
    ?.toLowerCase()
    .includes("mobile");

  const currentFeaturedSection = (form as any).featuredSection ?? "NONE";
  const currentIsTopSelling = (form as any).isTopSelling ?? false;
  const currentIsGaming = (form as any).isGaming ?? false;

  // ── Only one placement active at a time: Featured Section, Top Selling, Gaming ──
  const handleFeaturedSectionChange = (value: string) => {
    onChange("featuredSection" as any, value);
    if (value !== "NONE") {
      if (currentIsTopSelling) onChange("isTopSelling" as any, false);
      if (currentIsGaming) onChange("isGaming" as any, false);
    }
  };

  const handleTopSellingChange = (checked: boolean) => {
    onChange("isTopSelling" as any, checked);
    if (checked) {
      if (currentFeaturedSection !== "NONE") {
        onChange("featuredSection" as any, "NONE");
      }
      if (currentIsGaming) onChange("isGaming" as any, false);
    }
  };

  const handleGamingChange = (checked: boolean) => {
    onChange("isGaming" as any, checked);
    if (checked) {
      if (currentFeaturedSection !== "NONE") {
        onChange("featuredSection" as any, "NONE");
      }
      if (currentIsTopSelling) onChange("isTopSelling" as any, false);
    }
  };

  // ── Any placement already taken blocks the others ──
  const anyPlacementActive =
    currentFeaturedSection !== "NONE" || currentIsTopSelling || currentIsGaming;

  const featuredSectionDisabled = currentIsTopSelling || currentIsGaming;
  const topSellingDisabled =
    currentFeaturedSection !== "NONE" || currentIsGaming;
  const gamingDisabled =
    currentFeaturedSection !== "NONE" || currentIsTopSelling;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Basic Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Category <span className="text-red-500">*</span>
          </Label>
          <select
            title="category"
            value={form.categoryId}
            onChange={(e) => {
              onChange("categoryId", e.target.value);
              onChange("brandId", "");
              onChange("manualBrand" as any, "");
            }}
            className={selectClass}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand — dropdown for normal, text input for accessories */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Brand{" "}
            {isOtherAccessories ? (
              <span className="text-xs text-gray-400 font-normal">
                (optional — type manually)
              </span>
            ) : (
              <span className="text-red-500">*</span>
            )}
          </Label>
          {isOtherAccessories ? (
            <Input
              placeholder="e.g. ESR, Anker, Belkin"
              value={(form as any).manualBrand ?? ""}
              onChange={(e) => onChange("manualBrand" as any, e.target.value)}
            />
          ) : (
            <select
              title="brand"
              value={form.brandId ?? ""}
              onChange={(e) => onChange("brandId", e.target.value)}
              disabled={!form.categoryId}
              className={`${selectClass} ${!form.categoryId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">
                {!form.categoryId ? "Select category first" : "Select brand"}
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Apple iPhone 15 Pro Max"
            value={form.productName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>
            Subtitle <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. 48MP Camera · A17 Pro Chip · Titanium Design"
            value={form.productSubtitle}
            onChange={(e) => onChange("productSubtitle", e.target.value)}
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>
            Slug <span className="text-red-500">*</span>{" "}
            <span className="text-xs text-gray-400 font-normal">
              auto-generated
            </span>
          </Label>
          <Input
            placeholder="e.g. apple-iphone-15-pro-max"
            value={form.slug}
            onChange={(e) => onChange("slug", e.target.value)}
          />
        </div>

        {/* Featured Section — mutually exclusive with Top Selling and Gaming */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label>Featured Section</Label>
          <p className="text-xs text-gray-400 -mt-1">
            A product can only have one placement — Featured Section, Top
            Selling, or Gaming, not more than one.
          </p>
          <div
            className={`flex flex-wrap gap-5 ${
              featuredSectionDisabled ? "opacity-50" : ""
            }`}
          >
            <label
              className={`flex items-center gap-2 text-sm text-gray-700 ${
                featuredSectionDisabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="featuredSection"
                disabled={featuredSectionDisabled}
                checked={currentFeaturedSection === "NONE"}
                onChange={() => handleFeaturedSectionChange("NONE")}
                className="w-4 h-4"
              />
              None
            </label>
            <label
              className={`flex items-center gap-2 text-sm text-gray-700 ${
                featuredSectionDisabled
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="featuredSection"
                disabled={featuredSectionDisabled}
                checked={currentFeaturedSection === "MOST_LOVED"}
                onChange={() => handleFeaturedSectionChange("MOST_LOVED")}
                className="w-4 h-4"
              />
              Most Loved This Week
            </label>
            {isMobileCategory && (
              <label
                className={`flex items-center gap-2 text-sm text-gray-700 ${
                  featuredSectionDisabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="radio"
                  name="featuredSection"
                  disabled={featuredSectionDisabled}
                  checked={currentFeaturedSection === "PEOPLE_LOVE"}
                  onChange={() => handleFeaturedSectionChange("PEOPLE_LOVE")}
                  className="w-4 h-4"
                />
                Phones People Are Loving
              </label>
            )}
          </div>
        </div>

        {/* Trending — independent, optional, unaffected by placement rules */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isTrending"
            checked={form.isTrending}
            onChange={(e) => onChange("isTrending", e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label
            htmlFor="isTrending"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Mark as Trending
          </label>
        </div>

        {/* Top Selling — mutually exclusive with Featured Section and Gaming */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isTopSelling"
            checked={currentIsTopSelling}
            disabled={topSellingDisabled}
            onChange={(e) => handleTopSellingChange(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label
            htmlFor="isTopSelling"
            className={`text-sm text-gray-700 ${
              topSellingDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            Mark as Top Selling
          </label>
        </div>

        {/* Gaming — only for laptop category, mutually exclusive with Featured Section and Top Selling */}
        {isLaptopCategory && (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isGaming"
              checked={currentIsGaming}
              disabled={gamingDisabled}
              onChange={(e) => handleGamingChange(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label
              htmlFor="isGaming"
              className={`text-sm text-gray-700 ${
                gamingDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              Mark as Gaming Laptop
            </label>
          </div>
        )}

        {anyPlacementActive && (
          <p className="text-xs text-gray-400 sm:col-span-2 -mt-2">
            Only one placement can be active per product. Uncheck the current
            one to choose another.
          </p>
        )}
      </div>
    </div>
  );
};
