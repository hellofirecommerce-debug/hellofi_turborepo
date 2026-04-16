"use client";
import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_PRODUCT_NAMES } from "../../../../lib/graphql/queries/inventory.queries";
import { SearchableInput } from "@repo/ui";
import { useQuery } from "@apollo/client/react";
import { Input, Label, Button, AutoComplete } from "@repo/ui";
import { GET_BRANDS_BY_CATEGORY_ID } from "../../../../lib/graphql/queries/brand.queries";

import { GET_CATEGORIES } from "../../../../lib/graphql/queries/category.queries";
import { InventoryProduct } from "../types";

import {
  CreateInventoryProductInput,
  UpdateInventoryProductInput,
} from "@repo/validations";

interface Brand {
  id: string;
  name: string;
}
interface Category {
  id: string;
  name: string;
}

type InventoryFormData = CreateInventoryProductInput;

const initialForm: InventoryFormData = {
  imeiOrSerial: "",
  brandId: "",
  categoryId: "",
  purchaseDate: "",
  productName: "",
  costPrice: 0,
  otherCharges: 0,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  status: "NOT_LISTED",
  notes: "",
  screenCondition: "NO",
  bodyCondition: "NO",
  deviceIssues: "",
  hasBox: false,
  hasCharger: false,
  hasOriginalBill: false,
  warrantyType: "ABOVE_1_YEAR",
  warrantyPurchaseDate: "",
  ram: "",
  storage: "",
};

interface InventoryFormProps {
  editData?: InventoryProduct | null;
  onSubmit: (
    data: CreateInventoryProductInput | UpdateInventoryProductInput,
  ) => void;
  isLoading?: boolean;
}

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

const conditionOptions = [
  {
    value: "NO",
    label: "No",
    activeClass: "bg-green-50 border-green-300 text-green-700",
  },
  {
    value: "MINOR",
    label: "Minor",
    activeClass: "bg-yellow-50 border-yellow-300 text-yellow-700",
  },
  {
    value: "MAJOR",
    label: "Major",
    activeClass: "bg-red-50 border-red-300 text-red-700",
  },
] as const;

const RAM_OPTIONS = [
  "2GB",
  "3GB",
  "4GB",
  "6GB",
  "8GB",
  "12GB",
  "16GB",
  "32GB",
  "64GB",
];
const STORAGE_OPTIONS = [
  "16GB",
  "32GB",
  "64GB",
  "128GB",
  "256GB",
  "512GB",
  "1TB",
  "2TB",
];
const SPEC_CATEGORIES = ["Mobile Phone", "Laptop", "Tablet"];

export const InventoryForm: React.FC<InventoryFormProps> = ({
  editData,
  onSubmit,
  isLoading = false,
}) => {
  const [form, setForm] = useState<InventoryFormData>(initialForm);

  const { data: brandsData } = useQuery<{
    getBrandsByCategoryId: Brand[];
  }>(GET_BRANDS_BY_CATEGORY_ID, {
    variables: { categoryId: form.categoryId },
    skip: !form.categoryId, // ← don't fetch until category is selected
  });

  const [searchProductNames] = useLazyQuery<{
    searchProductNames: { names: string[]; hasMore: boolean };
  }>(SEARCH_PRODUCT_NAMES);

  const handleProductSearch = async (query: string): Promise<string[]> => {
    const { data } = await searchProductNames({
      variables: {
        query,
        categoryId: form.categoryId || undefined,
        brandId: form.brandId || undefined,
        page: 1,
      },
    });
    return data?.searchProductNames?.names ?? [];
  };

  const { data: categoriesData } = useQuery<{ getCategories: Category[] }>(
    GET_CATEGORIES,
  );

  const brands = brandsData?.getBrandsByCategoryId ?? [];
  const categories = categoriesData?.getCategories ?? [];

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const requiresSpecs = SPEC_CATEGORIES.includes(selectedCategory?.name ?? "");

  useEffect(() => {
    if (editData) {
      setForm({
        imeiOrSerial: editData.imeiOrSerial,
        brandId: editData.brandId,
        categoryId: editData.categoryId,
        purchaseDate: (editData.purchaseDate ?? "").split("T")[0] ?? "",
        productName: editData.productName,
        costPrice: editData.costPrice,
        otherCharges: editData.otherCharges,
        customerName: editData.customerName,
        customerEmail: editData.customerEmail ?? "",
        customerPhone: editData.customerPhone,
        customerAddress: editData.customerAddress,
        status: editData.status,
        notes: editData.notes ?? "",
        screenCondition:
          (editData.screenCondition as "MINOR" | "MAJOR" | "NO") ?? "NO",
        bodyCondition:
          (editData.bodyCondition as "MINOR" | "MAJOR" | "NO") ?? "NO",
        deviceIssues: editData.deviceIssues ?? "",
        hasBox: editData.hasBox ?? false,
        hasCharger: editData.hasCharger ?? false,
        hasOriginalBill: editData.hasOriginalBill ?? false,
        warrantyType:
          (editData.warrantyType as "ABOVE_1_YEAR" | "BELOW_1_YEAR") ??
          "ABOVE_1_YEAR",
        warrantyPurchaseDate: editData.warrantyPurchaseDate
          ? ((editData.warrantyPurchaseDate ?? "").split("T")[0] ?? "")
          : "",
        ram: editData.ram ?? "",
        storage: editData.storage ?? "",
      });
    }
  }, [editData]);

  const handleChange = (key: keyof InventoryFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: "hasBox" | "hasCharger" | "hasOriginalBill") => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isEdit = !!editData;

  const handleSubmit = () => {
    if (isEdit && editData) {
      const updateData: UpdateInventoryProductInput = {
        ...form,
        id: editData.id,
      };
      onSubmit(updateData);
    } else {
      onSubmit(form);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section: Product Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Product Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1 — Category */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
            <select
              title="Select category"
              value={form.categoryId}
              onChange={(e) => {
                handleChange("categoryId", e.target.value);
                handleChange("brandId", ""); // ← reset brand when category changes
              }}
              className={selectClass}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2 — Brand */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Brand <span className="text-red-500">*</span>
            </Label>
            <select
              title="Select brand"
              value={form.brandId}
              onChange={(e) => handleChange("brandId", e.target.value)}
              disabled={!form.categoryId} // ← disable until category selected
              className={`${selectClass} ${!form.categoryId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="" disabled>
                {!form.categoryId ? "Select category first" : "Select brand"}
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3 — Product Name */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Product Name <span className="text-red-500">*</span>
            </Label>
            <SearchableInput
              value={form.productName}
              onChange={(val) => handleChange("productName", val)}
              onSearch={handleProductSearch}
              placeholder="e.g. iPhone 14 Pro Max"
              title="Search product name"
            />
          </div>

          {/* 4 — IMEI / Serial */}
          <div className="flex flex-col gap-1.5">
            <Label>
              IMEI / Serial <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. 356938035643809"
              value={form.imeiOrSerial}
              onChange={(e) => handleChange("imeiOrSerial", e.target.value)}
            />
          </div>

          {/* 5 — RAM */}
          <div className="flex flex-col gap-1.5">
            <Label>
              RAM
              {requiresSpecs ? (
                <span className="text-red-500 ml-1">*</span>
              ) : (
                <span className="text-xs text-gray-400 ml-2 font-normal">
                  optional
                </span>
              )}
            </Label>
            <AutoComplete
              value={form.ram ?? ""}
              onChange={(val) => handleChange("ram", val)}
              options={RAM_OPTIONS}
              placeholder="e.g. 8GB"
              title="Select or enter RAM"
            />
          </div>

          {/* 6 — Storage */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Storage
              {requiresSpecs ? (
                <span className="text-red-500 ml-1">*</span>
              ) : (
                <span className="text-xs text-gray-400 ml-2 font-normal">
                  optional
                </span>
              )}
            </Label>
            <AutoComplete
              value={form.storage ?? ""}
              onChange={(val) => handleChange("storage", val)}
              options={STORAGE_OPTIONS}
              placeholder="e.g. 128GB"
              title="Select or enter Storage"
            />
          </div>

          {/* 7 — Purchase Date */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Purchase Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => handleChange("purchaseDate", e.target.value)}
            />
          </div>

          {/* 8 — Status */}
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <select
              title="Select status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={selectClass}
            >
              <option value="NOT_LISTED">Not Listed</option>
              <option value="LISTED">Listed</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section: Pricing */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>
              Cost Price (₹) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              placeholder="e.g. 45000"
              min={0}
              value={form.costPrice === 0 ? "" : String(form.costPrice)}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  costPrice: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Other Charges (₹)</Label>
            <Input
              type="number"
              placeholder="e.g. 500"
              min={0}
              value={form.otherCharges === 0 ? "" : String(form.otherCharges)}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  otherCharges: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Section: Device Condition */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Device Condition
        </h2>
        <div className="flex flex-col gap-5">
          {/* A - Screen */}
          <div className="flex flex-col gap-2">
            <Label>A) Scratches / Marks on Device Screen</Label>
            <div className="flex items-center gap-2">
              {conditionOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange("screenCondition", opt.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    form.screenCondition === opt.value
                      ? opt.activeClass
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* B - Body */}
          <div className="flex flex-col gap-2">
            <Label>B) Scratches / Marks / Dents on Device Body</Label>
            <div className="flex items-center gap-2">
              {conditionOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange("bodyCondition", opt.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    form.bodyCondition === opt.value
                      ? opt.activeClass
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* C - Issues */}
          <div className="flex flex-col gap-1.5">
            <Label>C) Any Issues with the Device</Label>
            <textarea
              placeholder="Describe any functional issues with the device..."
              value={form.deviceIssues}
              onChange={(e) => handleChange("deviceIssues", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25 resize-none"
            />
          </div>

          {/* D - Accessories */}
          <div className="flex flex-col gap-2">
            <Label>D) Accessories Included</Label>
            <div className="flex flex-wrap gap-3">
              {[
                { key: "hasBox" as const, label: "Box" },
                { key: "hasCharger" as const, label: "Charger" },
                { key: "hasOriginalBill" as const, label: "Original Bill" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleToggle(item.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    form[item.key]
                      ? "bg-[rgb(33,76,123)]/10 border-[rgb(33,76,123)] text-[rgb(33,76,123)]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      form[item.key]
                        ? "bg-[rgb(33,76,123)] border-[rgb(33,76,123)]"
                        : "border-gray-300"
                    }`}
                  >
                    {form[item.key] && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5l2 2 4-4"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section: Warranty */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Warranty</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {(["ABOVE_1_YEAR", "BELOW_1_YEAR"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleChange("warrantyType", opt)}
                className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  form.warrantyType === opt
                    ? "bg-[rgb(33,76,123)]/10 border-[rgb(33,76,123)] text-[rgb(33,76,123)]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt === "ABOVE_1_YEAR" ? "Above 1 Year" : "Below 1 Year"}
              </button>
            ))}
          </div>

          {form.warrantyType === "BELOW_1_YEAR" && (
            <div className="flex flex-col gap-1.5">
              <Label>
                Original Purchase Date <span className="text-red-500">*</span>
                <span className="text-xs text-gray-400 ml-2 font-normal">
                  When was the device originally purchased?
                </span>
              </Label>
              <Input
                type="date"
                value={form.warrantyPurchaseDate}
                onChange={(e) =>
                  handleChange("warrantyPurchaseDate", e.target.value)
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Section: Purchase Customer */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Purchase Customer
          <span className="text-xs text-gray-400 ml-2 font-normal">
            Who sold this to us
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Customer name"
              value={form.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. 9876543210"
              value={form.customerPhone}
              onChange={(e) => handleChange("customerPhone", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="customer@email.com"
              value={form.customerEmail}
              onChange={(e) => handleChange("customerEmail", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>
              Address <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Full address"
              value={form.customerAddress}
              onChange={(e) => handleChange("customerAddress", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section: Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Notes</h2>
        <textarea
          placeholder="Any additional notes..."
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25 resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button size="md" onClick={handleSubmit} disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Add to Inventory"}
        </Button>
      </div>
    </div>
  );
};
