"use client";
import React from "react";
import { Input, Label, Button } from "@repo/ui";
import { Plus, Trash2 } from "lucide-react";
import { CreateBuyingProductInput } from "@repo/validations";
import {
  SPEC_TEMPLATES,
  CATEGORY_LABELS,
} from "../../../../../lib/constants/specTemplates";

interface Props {
  specifications: CreateBuyingProductInput["specifications"];
  categoryId?: string;
  categoryName?: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, key: string, value: string) => void;
  onLoadTemplate: (
    specs: { key: string; value: string; group: string; sortOrder: number }[],
  ) => void;
}

export const BuyingProductSpecs: React.FC<Props> = ({
  specifications,
  categoryName,
  onAdd,
  onRemove,
  onUpdate,
  onLoadTemplate,
}) => {
  // ── match category name to template key ──
  const getTemplateKey = () => {
    if (!categoryName) return null;
    const lower = categoryName.toLowerCase();
    if (lower.includes("smart") || lower.includes("watch"))
      return "smart-watch";
    if (lower.includes("tablet")) return "tablet";
    if (lower.includes("laptop")) return "laptop";
    if (lower.includes("mobile") || lower.includes("phone"))
      return "mobile-phone";
    return null;
  };

  const templateKey = getTemplateKey();
  const template = templateKey ? SPEC_TEMPLATES[templateKey] : null;
  const templateLabel = templateKey ? CATEGORY_LABELS[templateKey] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Specifications
        </h3>
        <div className="flex items-center gap-2">
          {/* ← Load template button — only shown when category is selected */}
          {template && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoadTemplate(template)}
              className="gap-1.5 text-[rgb(33,76,123)] border-[rgb(33,76,123)]/30 hover:bg-blue-50"
            >
              Load {templateLabel} Template
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="gap-1.5"
          >
            <Plus size={14} />
            Add Spec
          </Button>
        </div>
      </div>

      {(specifications ?? []).length === 0 ? (
        <p className="text-sm text-gray-400">
          {template
            ? `No specifications added yet. Click "Load ${templateLabel} Template" to prefill.`
            : "No specifications added yet."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {(specifications ?? []).map((spec, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <Input
                placeholder="Key e.g. Display"
                value={spec.key}
                onChange={(e) => onUpdate(i, "key", e.target.value)}
              />
              <Input
                placeholder="Value e.g. 6.7 inch OLED"
                value={spec.value}
                onChange={(e) => onUpdate(i, "value", e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Group e.g. Display"
                  value={spec.group ?? ""}
                  onChange={(e) => onUpdate(i, "group", e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(i)}
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
  );
};
