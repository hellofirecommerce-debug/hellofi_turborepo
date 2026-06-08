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

        {/* Trending */}
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
      </div>
    </div>
  );
};
