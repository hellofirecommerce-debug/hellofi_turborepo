"use client";
import React, { useState, useEffect } from "react";
import { Input, Label, Button, ImageUpload } from "@repo/ui";
import { Plus, Trash2 } from "lucide-react";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../../../../../lib/graphql/queries/category.queries";
import { GET_BRANDS } from "../../../../../lib/graphql/queries/brand.queries";
import { GET_SERIES } from "../../../../../lib/graphql/queries/series.queries";
import {
  CreateSellingProductInput,
  CreateSellingVariantInput,
} from "@repo/validations";
import { SellingProduct } from "../types";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

interface Props {
  onSubmit: (data: CreateSellingProductInput, image: File | null) => void;
  isLoading?: boolean;
  editData?: SellingProduct | null;
}

const initialVariant: CreateSellingVariantInput = {
  ram: "",
  storage: "",
  productPrice: 0,
  status: "ACTIVE",
};

export const SellingProductForm: React.FC<Props> = ({
  onSubmit,
  isLoading = false,
  editData = null,
}) => {
  const isEdit = !!editData;

  const [form, setForm] = useState<CreateSellingProductInput>({
    productName: "",
    productSeoName: "",
    brandId: "",
    categoryId: "",
    seriesId: "",
    releasedYear: undefined,
    productPrice: undefined,
    status: "ACTIVE",
    hasVariants: false,
    isConstantRam: false,
    ram: "",
    variants: [],
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
  const [fetchSeries, { data: seriesData }] = useLazyQuery<{
    getSeries: { items: { id: string; seriesName: string }[] };
  }>(GET_SERIES);

  const categories = categoriesData?.getCategories ?? [];
  const allBrands = brandsData?.getBrands ?? [];
  const brands = form.categoryId
    ? allBrands.filter((b) =>
        b.brandCategories?.some((bc) => bc.categoryId === form.categoryId),
      )
    : allBrands;
  const seriesList = seriesData?.getSeries?.items ?? [];

  useEffect(() => {
    if (form.categoryId) {
      fetchSeries({
        variables: { filter: { categoryId: form.categoryId, pageSize: 100 } },
      });
    }
  }, [form.categoryId]);

  useEffect(() => {
    if (editData) {
      setForm({
        productName: editData.productName,
        productSeoName: editData.productSeoName,
        brandId: editData.brandId,
        categoryId: editData.categoryId,
        seriesId: editData.seriesId,
        releasedYear: editData.releasedYear,
        productPrice: editData.productPrice,
        status: editData.status,
        hasVariants: editData.hasVariants,
        isConstantRam: editData.isConstantRam,
        ram: editData.ram ?? "",
        variants: editData.variants.map((v) => ({
          ram: v.ram ?? "",
          storage: v.storage,
          productPrice: v.productPrice,
          status: v.status,
        })),
      });
      setPreview(
        editData.image && editData.image !== "pending"
          ? `${process.env.NEXT_PUBLIC_CDN_URL}/${editData.image}`
          : null,
      );
    }
  }, [editData]);

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      productName: value,
      productSeoName: value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setForm((prev) => ({ ...prev, categoryId, brandId: "", seriesId: "" }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...(prev.variants ?? []), { ...initialVariant }],
    }));
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (
    index: number,
    key: keyof CreateSellingVariantInput,
    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).map((v, i) =>
        i === index ? { ...v, [key]: value } : v,
      ),
    }));
  };

  const handleSubmit = () => {
    onSubmit(form, image);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6">
      {/* Image */}
      <div className="flex flex-col gap-1.5">
        <Label>
          Product Image {!isEdit && <span className="text-red-500">*</span>}
          <span className="text-xs text-gray-400 ml-2 font-normal">
            400×400px recommended
          </span>
        </Label>
        <ImageUpload
          preview={preview}
          file={image}
          onFileChange={(file) => {
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
          onRemove={() => {
            setImage(null);
            setPreview(null);
          }}
          label="Click to upload product image"
          hint="PNG, JPG, WEBP · 400×400px"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Samsung Galaxy S24 Ultra"
            value={form.productName}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        {/* SEO Name */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>
            SEO Name <span className="text-red-500">*</span>
            <span className="text-xs text-gray-400 ml-2 font-normal">
              auto-generated
            </span>
          </Label>
          <Input
            placeholder="e.g. samsung-galaxy-s24-ultra"
            value={form.productSeoName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, productSeoName: e.target.value }))
            }
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Category <span className="text-red-500">*</span>
          </Label>
          <select
            title="category"
            value={form.categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
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

        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Brand <span className="text-red-500">*</span>
          </Label>
          <select
            title="brand"
            value={form.brandId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, brandId: e.target.value }))
            }
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
        </div>

        {/* Series */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Series <span className="text-red-500">*</span>
          </Label>
          <select
            title="series"
            value={form.seriesId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, seriesId: e.target.value }))
            }
            disabled={!form.categoryId}
            className={`${selectClass} ${!form.categoryId ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <option value="">
              {!form.categoryId ? "Select category first" : "Select series"}
            </option>
            {seriesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.seriesName}
              </option>
            ))}
          </select>
        </div>

        {/* Released Year */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Released Year{" "}
            <span className="text-xs text-gray-400 font-normal">
              (optional)
            </span>
          </Label>
          <Input
            type="number"
            placeholder="e.g. 2024"
            value={form.releasedYear ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                releasedYear: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              }))
            }
          />
        </div>

        {/* Product Price (no variants) */}
        {!form.hasVariants && (
          <div className="flex flex-col gap-1.5">
            <Label>
              Price (₹){" "}
              <span className="text-xs text-gray-400 font-normal">
                (optional)
              </span>
            </Label>
            <Input
              type="number"
              placeholder="e.g. 99999"
              value={form.productPrice ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  productPrice: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
            />
          </div>
        )}

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <Label>Status</Label>
          <div className="flex gap-2">
            {(["ACTIVE", "INACTIVE"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.status === s
                    ? s === "ACTIVE"
                      ? "bg-green-50 border-green-300 text-green-700"
                      : "bg-red-50 border-red-300 text-red-700"
                    : "border-gray-200 text-gray-400 hover:bg-gray-50"
                }`}
              >
                {s === "ACTIVE" ? "Active" : "Inactive"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Has Variants Toggle */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <input
          type="checkbox"
          id="hasVariants"
          checked={form.hasVariants}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              hasVariants: e.target.checked,
              variants: e.target.checked ? [{ ...initialVariant }] : [],
            }))
          }
          className="w-4 h-4 rounded border-gray-300 text-[rgb(33,76,123)]"
        />
        <label
          htmlFor="hasVariants"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          This product has variants (RAM/Storage combinations)
        </label>
      </div>

      {/* isConstantRam Toggle — only when hasVariants */}
      {form.hasVariants && (
        <div className="flex flex-col gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isConstantRam"
              checked={form.isConstantRam}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isConstantRam: e.target.checked,
                  ram: "",
                }))
              }
              className="w-4 h-4 rounded border-gray-300"
            />
            <label
              htmlFor="isConstantRam"
              className="text-sm font-medium text-blue-800 cursor-pointer"
            >
              Constant RAM across all variants
            </label>
          </div>
          {form.isConstantRam && (
            <div className="flex flex-col gap-1.5">
              <Label>
                RAM <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. 8GB"
                value={form.ram ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ram: e.target.value }))
                }
                className="max-w-xs"
              />
            </div>
          )}
        </div>
      )}

      {/* Variants */}
      {form.hasVariants && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>
              Variants <span className="text-red-500">*</span>
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addVariant}
              className="gap-1.5"
            >
              <Plus size={14} />
              Add Variant
            </Button>
          </div>

          {(form.variants ?? []).map((variant, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  Variant {index + 1}
                </span>
                {(form.variants ?? []).length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariant(index)}
                    className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {!form.isConstantRam && (
                  <div className="flex flex-col gap-1.5">
                    <Label>
                      RAM{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      placeholder="e.g. 8GB"
                      value={variant.ram ?? ""}
                      onChange={(e) =>
                        updateVariant(index, "ram", e.target.value)
                      }
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label>
                    Storage <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. 256GB"
                    value={variant.storage}
                    onChange={(e) =>
                      updateVariant(index, "storage", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>
                    Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 99999"
                    value={variant.productPrice || ""}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "productPrice",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Status</Label>
                  <select
                    title="status"
                    value={variant.status}
                    onChange={(e) =>
                      updateVariant(index, "status", e.target.value as any)
                    }
                    className={selectClass}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button
          size="md"
          onClick={handleSubmit}
          disabled={isLoading}
          className="min-w-32"
        >
          {isLoading ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
        </Button>
      </div>
    </div>
  );
};
