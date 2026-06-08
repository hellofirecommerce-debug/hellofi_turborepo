"use client";
import React from "react";
import { Button } from "@repo/ui";
import { Plus } from "lucide-react";
import { CreateBuyingVariantInput } from "@repo/validations";
import { BuyingProductVariantCard } from "./BuyingProductVariantCard";
import { VariantImageEntry, VariantImageState } from "../types";

interface Props {
  variants: CreateBuyingVariantInput[];
  variantKeys: string[];
  variantImageMap: Map<string, VariantImageState>;
  expandedVariants: number[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    key: keyof CreateBuyingVariantInput,
    value: any,
  ) => void;
  onToggleExpand: (index: number) => void;
  onImagesChange: (key: string, images: VariantImageEntry[]) => void;
  onDefaultChange: (key: string, defaultImageIndex: number) => void;
}

export const BuyingProductVariants: React.FC<Props> = ({
  variants,
  variantKeys,
  variantImageMap,
  expandedVariants,
  onAdd,
  onRemove,
  onUpdate,
  onToggleExpand,
  onImagesChange,
  onDefaultChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Variants{" "}
          <span className="text-gray-400 font-normal normal-case">
            ({variants.length})
          </span>
        </h3>
        <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5">
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
          const key = variantKeys[index] ?? "";
          const imgState = variantImageMap.get(key) ?? {
            images: [],
            defaultImageIndex: 0,
          };
          return (
            <BuyingProductVariantCard
              key={key}
              variant={variant}
              index={index}
              isExpanded={expandedVariants.includes(index)}
              showRemove={variants.length > 1}
              imgState={imgState}
              onToggle={() => onToggleExpand(index)}
              onRemove={() => onRemove(index)}
              onUpdate={(k, value) => onUpdate(index, k, value)}
              onImagesChange={(images) => onImagesChange(key, images)}
              onDefaultChange={(defaultImageIndex) =>
                onDefaultChange(key, defaultImageIndex)
              }
            />
          );
        })
      )}
    </div>
  );
};
