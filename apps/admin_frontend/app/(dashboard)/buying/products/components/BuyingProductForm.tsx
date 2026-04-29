"use client";
import React, { useState, useEffect } from "react";
import { Input, Label, Button } from "@repo/ui";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../../../../../lib/graphql/queries/category.queries";
import { GET_BRANDS } from "../../../../../lib/graphql/queries/brand.queries";
import { VariantImagesUpload } from "./VariantImagesUpload";
import {
  CreateBuyingProductInput,
  CreateBuyingVariantInput,
} from "@repo/validations";
import { BuyingProduct } from "../types";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

interface VariantImageEntry {
  file: File;
  preview: string;
}

interface VariantImageState {
  images: VariantImageEntry[];
  defaultImageIndex: number;
}

interface Props {
  onSubmit: (
    data: CreateBuyingProductInput,
    productImages: File[],
    productDefaultImageIndex: number,
    variantImages: VariantImageState[],
  ) => void;
  isLoading?: boolean;
  editData?: BuyingProduct | null;
}

const initialVariant: CreateBuyingVariantInput = {
  sku: "",
  shortId: "",
  storage: "",
  ram: "",
  price: 0,
  mrp: 0,
  quantity: 0,
  condition: "GOOD",
  warrantyType: "BRAND_WARRANTY",
  whatsInTheBox: [],
  availability: "IN_STOCK",
};

export const BuyingProductForm: React.FC<Props> = ({
  onSubmit,
  isLoading = false,
  editData = null,
}) => {
  const isEdit = !!editData;

  const [form, setForm] = useState<CreateBuyingProductInput>({
    productName: "",
    productSubtitle: "",
    slug: "",
    brandId: "",
    categoryId: "",
    isTrending: false,
    specifications: [],
    variants: [],
  });

  const [variantImageStates, setVariantImageStates] = useState<
    VariantImageState[]
  >([]);
  const [expandedVariants, setExpandedVariants] = useState<number[]>([0]);

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
  const brands = form.categoryId
    ? allBrands.filter((b) =>
        b.brandCategories?.some((bc) => bc.categoryId === form.categoryId),
      )
    : allBrands;

  useEffect(() => {
    if (editData) {
      setForm({
        productName: editData.productName,
        productSubtitle: editData.productSubtitle,
        slug: editData.slug,
        brandId: editData.brandId,
        categoryId: editData.categoryId,
        isTrending: editData.isTrending,
        specifications: editData.specifications.map((s) => ({
          key: s.key,
          value: s.value,
          group: s.group,
          sortOrder: s.sortOrder,
        })),
        variants: [],
      });
    }
  }, [editData]);

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      productName: value,
      slug: value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const addVariant = () => {
    const newIndex = (form.variants ?? []).length;
    setForm((prev) => ({
      ...prev,
      variants: [...(prev.variants ?? []), { ...initialVariant }],
    }));
    setVariantImageStates((prev) => [
      ...prev,
      { images: [], defaultImageIndex: 0 },
    ]);
    setExpandedVariants((prev) => [...prev, newIndex]);
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).filter((_, i) => i !== index),
    }));
    setVariantImageStates((prev) => prev.filter((_, i) => i !== index));
    setExpandedVariants((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const updateVariant = (
    index: number,
    key: keyof CreateBuyingVariantInput,
    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).map((v, i) =>
        i === index ? { ...v, [key]: value } : v,
      ),
    }));
  };

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [
        ...(prev.specifications ?? []),
        {
          key: "",
          value: "",
          group: "",
          sortOrder: (prev.specifications ?? []).length,
        },
      ],
    }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specifications: (prev.specifications ?? []).filter((_, i) => i !== index),
    }));
  };

  const updateSpec = (index: number, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      specifications: (prev.specifications ?? []).map((s, i) =>
        i === index ? { ...s, [key]: value } : s,
      ),
    }));
  };

  const toggleVariantExpand = (index: number) => {
    setExpandedVariants((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleSubmit = () => {
    onSubmit(
      form,
      [], // ← no product images
      0,
      variantImageStates,
    );
  };

  const variants = form.variants ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Basic Info ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. Apple iPhone 15 Pro Max"
              value={form.productName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>
              Subtitle <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. 48MP Camera · A17 Pro Chip · Titanium Design"
              value={form.productSubtitle}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  productSubtitle: e.target.value,
                }))
              }
            />
          </div>
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
              onChange={(e) =>
                setForm((prev) => ({ ...prev, slug: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
            <select
              title="category"
              value={form.categoryId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  categoryId: e.target.value,
                  brandId: "",
                }))
              }
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
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isTrending"
              checked={form.isTrending}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isTrending: e.target.checked }))
              }
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

      {/* ── Specifications ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Specifications
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addSpec}
            className="gap-1.5"
          >
            <Plus size={14} />
            Add Spec
          </Button>
        </div>
        {(form.specifications ?? []).length === 0 ? (
          <p className="text-sm text-gray-400">No specifications added yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {(form.specifications ?? []).map((spec, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 items-center">
                <Input
                  placeholder="Key e.g. Display"
                  value={spec.key}
                  onChange={(e) => updateSpec(i, "key", e.target.value)}
                />
                <Input
                  placeholder="Value e.g. 6.7 inch OLED"
                  value={spec.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Group e.g. Display"
                    value={spec.group ?? ""}
                    onChange={(e) => updateSpec(i, "group", e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSpec(i)}
                    className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Variants ── */}
      {!isEdit && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Variants{" "}
              <span className="text-gray-400 font-normal normal-case">
                ({variants.length})
              </span>
            </h3>
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

          {variants.length === 0 ? (
            <p className="text-sm text-gray-400">
              No variants added yet. Click "Add Variant" to start.
            </p>
          ) : (
            variants.map((variant, index) => {
              const isExpanded = expandedVariants.includes(index);
              const imgState = variantImageStates[index] ?? {
                images: [],
                defaultImageIndex: 0,
              };

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Variant header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleVariantExpand(index)}
                  >
                    <span className="text-sm font-semibold text-gray-700">
                      Variant {index + 1}
                      {variant.storage && (
                        <span className="ml-2 text-gray-400 font-normal">
                          {variant.ram && `${variant.ram} / `}
                          {variant.storage}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      {variants.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVariant(index);
                          }}
                          className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </Button>
                      )}
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            SKU <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g. APL-IP15PM-256-BLK"
                            value={variant.sku}
                            onChange={(e) =>
                              updateVariant(index, "sku", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Short ID <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g. IP15PM256"
                            value={variant.shortId}
                            onChange={(e) =>
                              updateVariant(index, "shortId", e.target.value)
                            }
                          />
                        </div>
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
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Price (₹) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="e.g. 89999"
                            value={variant.price || ""}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "price",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            MRP (₹) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="e.g. 139900"
                            value={variant.mrp || ""}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "mrp",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            EMI Base Price{" "}
                            <span className="text-xs text-gray-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="e.g. 3000"
                            value={variant.emiBasePrice ?? ""}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "emiBasePrice",
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Quantity <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="number"
                            placeholder="e.g. 10"
                            value={variant.quantity || ""}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Condition <span className="text-red-500">*</span>
                          </Label>
                          <select
                            title="condition"
                            value={variant.condition}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "condition",
                                e.target.value as any,
                              )
                            }
                            className={selectClass}
                          >
                            {[
                              "UNBOXED",
                              "SUPERB",
                              "GOOD",
                              "FAIR",
                              "PARTIALLY_FAIR",
                            ].map((c) => (
                              <option key={c} value={c}>
                                {c.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>Availability</Label>
                          <select
                            title="availability"
                            value={variant.availability}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "availability",
                                e.target.value as any,
                              )
                            }
                            className={selectClass}
                          >
                            <option value="IN_STOCK">In Stock</option>
                            <option value="OUT_OF_STOCK">Out of Stock</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Warranty Type{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <select
                            title="warranty"
                            value={variant.warrantyType}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "warrantyType",
                                e.target.value as any,
                              )
                            }
                            className={selectClass}
                          >
                            <option value="BRAND_WARRANTY">
                              Brand Warranty
                            </option>
                            <option value="HELLOFI_WARRANTY">
                              HelloFi Warranty
                            </option>
                            <option value="NO_WARRANTY">No Warranty</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Color{" "}
                            <span className="text-xs text-gray-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            placeholder="e.g. Black Titanium"
                            value={variant.color ?? ""}
                            onChange={(e) =>
                              updateVariant(index, "color", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Color Code{" "}
                            <span className="text-xs text-gray-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            type="color"
                            value={variant.colorCode ?? "#000000"}
                            onChange={(e) =>
                              updateVariant(index, "colorCode", e.target.value)
                            }
                            className="h-9 px-1 py-1"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Screen Size{" "}
                            <span className="text-xs text-gray-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            placeholder="e.g. 6.7 inch"
                            value={variant.screenSize ?? ""}
                            onChange={(e) =>
                              updateVariant(index, "screenSize", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Processor{" "}
                            <span className="text-xs text-gray-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            placeholder="e.g. A17 Pro"
                            value={variant.processor ?? ""}
                            onChange={(e) =>
                              updateVariant(index, "processor", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Battery{" "}
                            <span className="text-xs text-gray-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            placeholder="e.g. 4422 mAh"
                            value={variant.batteryCapacity ?? ""}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "batteryCapacity",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Live Link{" "}
                            <span className="text-xs text-gray-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            placeholder="https://..."
                            value={variant.liveLink ?? ""}
                            onChange={(e) =>
                              updateVariant(index, "liveLink", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>
                            Warranty Description{" "}
                            <span className="text-xs text-gray-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <Input
                            placeholder="e.g. 1 Year Brand Warranty"
                            value={variant.warrantyDescription ?? ""}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "warrantyDescription",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* What's in the box */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Label>What's in the Box</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateVariant(index, "whatsInTheBox", [
                                ...(variant.whatsInTheBox ?? []),
                                "",
                              ])
                            }
                            className="gap-1 text-xs"
                          >
                            <Plus size={12} />
                            Add Item
                          </Button>
                        </div>
                        {(variant.whatsInTheBox ?? []).map((item, wi) => (
                          <div key={wi} className="flex gap-2">
                            <Input
                              placeholder="e.g. USB-C Cable"
                              value={item}
                              onChange={(e) => {
                                const updated = [
                                  ...(variant.whatsInTheBox ?? []),
                                ];
                                updated[wi] = e.target.value;
                                updateVariant(index, "whatsInTheBox", updated);
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                updateVariant(
                                  index,
                                  "whatsInTheBox",
                                  (variant.whatsInTheBox ?? []).filter(
                                    (_, i) => i !== wi,
                                  ),
                                )
                              }
                              className="h-9 w-9 text-red-400 hover:text-red-600 shrink-0"
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Variant images */}
                      <VariantImagesUpload
                        variantIndex={index}
                        variantLabel={`Variant ${index + 1}`}
                        images={imgState.images}
                        defaultImageIndex={imgState.defaultImageIndex}
                        onImagesChange={(images) =>
                          setVariantImageStates((prev) =>
                            prev.map((s, i) =>
                              i === index ? { ...s, images } : s,
                            ),
                          )
                        }
                        onDefaultChange={(defaultImageIndex) =>
                          setVariantImageStates((prev) =>
                            prev.map((s, i) =>
                              i === index ? { ...s, defaultImageIndex } : s,
                            ),
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Submit ── */}
      <div className="flex justify-end gap-3 pb-6">
        <Button
          size="md"
          onClick={handleSubmit}
          disabled={isLoading}
          className="min-w-40"
        >
          {isLoading ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
        </Button>
      </div>
    </div>
  );
};
