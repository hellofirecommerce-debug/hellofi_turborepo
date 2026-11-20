"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Input, Label, Button } from "@repo/ui";
import { GET_ASSESSMENTS } from "../../../../../lib/graphql/queries/assessment.queries";
import { BrandPicker } from "../../../../../components/ui/BrandPicker";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

const STEP_CATEGORIES = [
  "BASICS",
  "DEVICE_DEFECTS",
  "COSMETIC_CONDITION",
  "ACCESSORIES",
  "LAPTOP_SYSTEM_CONFIG",
  "SPECIFICATION",
  "PRICING",
];

const idsFrom = (list?: { brandId?: string | null }[]): string[] =>
  (list ?? []).map((bv) => bv.brandId).filter(Boolean) as string[];

interface Props {
  initialData?: {
    id?: string;
    assessmentId: string;
    stepCategory: string;
    stepNumber: number;
    stepName: string;
    title?: string;
    subtitle?: string;
    description?: string;
    priority?: number;
    brandVisibilityStrategy?: string;
    brandVisibility?: { brandId?: string | null }[];
  };
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const StepForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isLoading,
  isEdit,
}) => {
  const [form, setForm] = useState({
    assessmentId: initialData?.assessmentId ?? "",
    stepCategory: initialData?.stepCategory ?? "BASICS",
    stepNumber: initialData?.stepNumber ?? 1,
    stepName: initialData?.stepName ?? "",
    title: initialData?.title ?? "",
    subtitle: initialData?.subtitle ?? "",
    description: initialData?.description ?? "",
    priority: initialData?.priority ?? 0,
    brandVisibilityStrategy: initialData?.brandVisibilityStrategy ?? "ALL",
  });

  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(
    idsFrom(initialData?.brandVisibility),
  );

  const { data: assessData } = useQuery<any>(GET_ASSESSMENTS);
  const assessments = assessData?.getAssessments?.items ?? [];

  useEffect(() => {
    if (initialData) {
      setForm({
        assessmentId: initialData.assessmentId ?? "",
        stepCategory: initialData.stepCategory ?? "BASICS",
        stepNumber: initialData.stepNumber ?? 1,
        stepName: initialData.stepName ?? "",
        title: initialData.title ?? "",
        subtitle: initialData.subtitle ?? "",
        description: initialData.description ?? "",
        priority: initialData.priority ?? 0,
        brandVisibilityStrategy: initialData.brandVisibilityStrategy ?? "ALL",
      });
      setSelectedBrandIds(idsFrom(initialData.brandVisibility));
    }
  }, [initialData]);

  const toggleBrand = (brandId: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleSubmit = () => {
    if (!form.stepName.trim()) return;
    if (!isEdit && !form.assessmentId) return;

    const brandVisibility =
      form.brandVisibilityStrategy !== "ALL"
        ? selectedBrandIds.map((id) => ({ brandId: id }))
        : [];

    onSubmit({
      assessmentId: form.assessmentId,
      stepCategory: form.stepCategory,
      stepNumber: form.stepNumber,
      stepName: form.stepName,
      title: form.title || undefined,
      subtitle: form.subtitle || undefined,
      description: form.description || undefined,
      priority: form.priority,
      brandVisibilityStrategy: form.brandVisibilityStrategy,
      brandVisibility,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      {!isEdit && (
        <div className="flex flex-col gap-1.5">
          <Label>
            Assessment <span className="text-red-500">*</span>
          </Label>
          <select
            value={form.assessmentId}
            onChange={(e) => {
              setForm((p) => ({ ...p, assessmentId: e.target.value }));
              setSelectedBrandIds([]);
            }}
            className={selectClass}
          >
            <option value="">Select assessment</option>
            {assessments.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.name}
                {a.category?.name ? ` — ${a.category.name}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>
            Step Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Basics"
            value={form.stepName}
            onChange={(e) =>
              setForm((p) => ({ ...p, stepName: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>
            Step Category <span className="text-red-500">*</span>
          </Label>
          <select
            value={form.stepCategory}
            onChange={(e) =>
              setForm((p) => ({ ...p, stepCategory: e.target.value }))
            }
            className={selectClass}
          >
            {STEP_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>
            Step Number <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            value={form.stepNumber}
            onChange={(e) =>
              setForm((p) => ({ ...p, stepNumber: Number(e.target.value) }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Priority</Label>
          <Input
            type="number"
            value={form.priority}
            onChange={(e) =>
              setForm((p) => ({ ...p, priority: Number(e.target.value) }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Title</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Subtitle</Label>
          <Input
            value={form.subtitle}
            onChange={(e) =>
              setForm((p) => ({ ...p, subtitle: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Brand Visibility</Label>
          <select
            value={form.brandVisibilityStrategy}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                brandVisibilityStrategy: e.target.value,
              }))
            }
            className={selectClass}
          >
            <option value="ALL">All Brands</option>
            <option value="INCLUDE">Show only for specific brands</option>
            <option value="EXCLUDE">Skip for specific brands</option>
          </select>
        </div>
      </div>

      <BrandPicker
        assessmentId={form.assessmentId}
        strategy={form.brandVisibilityStrategy}
        selectedIds={selectedBrandIds}
        onToggle={toggleBrand}
      />

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button size="md" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update Step" : "Create Step"}
        </Button>
      </div>
    </div>
  );
};
