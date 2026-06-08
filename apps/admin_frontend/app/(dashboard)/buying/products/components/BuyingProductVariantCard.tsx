"use client";
import React from "react";
import { Input, Label, Button } from "@repo/ui";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { CreateBuyingVariantInput } from "@repo/validations";
import { VariantImagesUpload } from "./VariantImagesUpload";
import { VariantImageEntry, VariantImageState } from "../types";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

interface Props {
  variant: CreateBuyingVariantInput;
  index: number;
  isExpanded: boolean;
  showRemove: boolean;
  imgState: VariantImageState;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (key: keyof CreateBuyingVariantInput, value: any) => void;
  onImagesChange: (images: VariantImageEntry[]) => void;
  onDefaultChange: (index: number) => void;
}

export const BuyingProductVariantCard: React.FC<Props> = ({
  variant,
  index,
  isExpanded,
  showRemove,
  imgState,
  onToggle,
  onRemove,
  onUpdate,
  onImagesChange,
  onDefaultChange,
}) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        <span className="text-sm font-semibold text-gray-700">
          Variant {index + 1}
          {variant.variantSubtitle && (
            <span className="ml-2 text-gray-400 font-normal">
              {variant.variantSubtitle}
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {showRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
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
            {/* Variant Subtitle */}
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <Label>
                Variant Subtitle <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. 256GB · Midnight Black · Brand Warranty"
                value={variant.variantSubtitle ?? ""}
                onChange={(e) => onUpdate("variantSubtitle", e.target.value)}
              />
            </div>

            {/* Inventory Link */}
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <Label>
                Link to Inventory{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="Enter Inventory Product ID"
                value={(variant as any).inventoryProductId ?? ""}
                onChange={(e) =>
                  onUpdate("inventoryProductId" as any, e.target.value)
                }
              />
              {(variant as any).inventoryProductId && (
                <p className="text-xs text-[rgb(33,76,123)]">
                  ✓ Linked to inventory: {(variant as any).inventoryProductId}
                </p>
              )}
            </div>

            {/* Storage */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Storage{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="e.g. 256GB"
                value={variant.storage ?? ""}
                onChange={(e) => onUpdate("storage", e.target.value)}
              />
            </div>

            {/* RAM */}
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
                onChange={(e) => onUpdate("ram", e.target.value)}
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Price (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="e.g. 89999"
                value={variant.price || ""}
                onChange={(e) => onUpdate("price", Number(e.target.value))}
              />
            </div>

            {/* MRP */}
            <div className="flex flex-col gap-1.5">
              <Label>
                MRP (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="e.g. 139900"
                value={variant.mrp || ""}
                onChange={(e) => onUpdate("mrp", Number(e.target.value))}
              />
            </div>

            {/* EMI Base Price */}
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
                  onUpdate(
                    "emiBasePrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="e.g. 10"
                value={variant.quantity || ""}
                onChange={(e) => onUpdate("quantity", Number(e.target.value))}
              />
            </div>

            {/* Condition */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Condition <span className="text-red-500">*</span>
              </Label>
              <select
                title="condition"
                value={variant.condition}
                onChange={(e) => onUpdate("condition", e.target.value as any)}
                className={selectClass}
              >
                {["UNBOXED", "SUPERB", "GOOD", "FAIR", "PARTIALLY_FAIR"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c.replace(/_/g, " ")}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Availability */}
            <div className="flex flex-col gap-1.5">
              <Label>Availability</Label>
              <select
                title="availability"
                value={variant.availability}
                onChange={(e) =>
                  onUpdate("availability", e.target.value as any)
                }
                className={selectClass}
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            {/* Warranty Type */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Warranty Type <span className="text-red-500">*</span>
              </Label>
              <select
                title="warranty"
                value={variant.warrantyType}
                onChange={(e) =>
                  onUpdate("warrantyType", e.target.value as any)
                }
                className={selectClass}
              >
                <option value="BRAND_WARRANTY">Brand Warranty</option>
                <option value="HELLOFI_WARRANTY">HelloFi Warranty</option>
                <option value="NO_WARRANTY">No Warranty</option>
              </select>
            </div>

            {/* Color */}
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
                onChange={(e) => onUpdate("color", e.target.value)}
              />
            </div>

            {/* Color Code */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Color Code{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (optional)
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <input
                  title="color-code-input"
                  type="color"
                  value={variant.colorCode || "#000000"}
                  onChange={(e) => onUpdate("colorCode", e.target.value)}
                  className="h-9 w-12 px-1 py-1 border border-gray-300 rounded-md cursor-pointer"
                />
                <Input
                  placeholder="#000000"
                  value={variant.colorCode ?? ""}
                  onChange={(e) => onUpdate("colorCode", e.target.value)}
                />
              </div>
            </div>

            {/* Screen Size */}
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
                onChange={(e) => onUpdate("screenSize", e.target.value)}
              />
            </div>

            {/* Processor */}
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
                onChange={(e) => onUpdate("processor", e.target.value)}
              />
            </div>

            {/* Battery */}
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
                onChange={(e) => onUpdate("batteryCapacity", e.target.value)}
              />
            </div>

            {/* Live Link */}
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
                onChange={(e) => onUpdate("liveLink", e.target.value)}
              />
            </div>

            {/* Warranty Description */}
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
                  onUpdate("warrantyDescription", e.target.value)
                }
              />
            </div>
          </div>

          {/* What's in the Box */}
          <div className="flex flex-col gap-2">
            <Label>What's in the Box</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "Original Brand Box",
                "Original Cable",
                "Original Adapter",
                "Additional Original Adapter",
                "Original Bill",
                "HelloFi GST Bill",
                "Original Charger",
                "Apple Pencil",
                "Magic Keyboard",
                "Smart Folio Cover",
              ].map((item) => {
                const isSelected = (variant.whatsInTheBox ?? []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      const current = variant.whatsInTheBox ?? [];
                      onUpdate(
                        "whatsInTheBox",
                        isSelected
                          ? current.filter((i) => i !== item)
                          : [...current, item],
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-[rgb(33,76,123)] text-white border-[rgb(33,76,123)]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)]"
                    }`}
                  >
                    {isSelected ? "✓ " : ""}
                    {item}
                  </button>
                );
              })}
            </div>
            {(variant.whatsInTheBox ?? []).length > 0 && (
              <p className="text-xs text-gray-400">
                Selected: {(variant.whatsInTheBox ?? []).join(", ")}
              </p>
            )}
          </div>

          {/* What's Extra */}
          <div className="flex flex-col gap-1.5">
            <Label>
              What's Extra{" "}
              <span className="text-xs text-gray-400 font-normal">
                (optional)
              </span>
            </Label>
            <textarea
              placeholder="e.g. Free screen guard worth ₹499, Extra back cover included..."
              value={variant.whatsExtra ?? ""}
              onChange={(e) => onUpdate("whatsExtra", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25 resize-none"
            />
          </div>

          <VariantImagesUpload
            variantIndex={index}
            variantLabel={`Variant ${index + 1}`}
            images={imgState.images}
            defaultImageIndex={imgState.defaultImageIndex}
            onImagesChange={onImagesChange}
            onDefaultChange={onDefaultChange}
          />
        </div>
      )}
    </div>
  );
};
