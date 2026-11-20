"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Input, Label, Button, ImageUpload } from "@repo/ui";
import {
  GET_ASSESSMENTS,
  GET_STEPS,
} from "../../../../../lib/graphql/queries/assessment.queries";
import { GET_BRANDS_BY_CATEGORY_ID } from "../../../../../lib/graphql/queries/brand.queries";
import { GET_OPTIONS } from "../../../../../lib/graphql/queries/option.queries";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

const CONDITION_TYPES = [
  "BOOLEAN",
  "RADIO",
  "MULTI_SELECT",
  "MULTI_SELECT_INVERTED",
  "DROPDOWN",
];

// must match the names in the user frontend accessoryIcons.tsx
const ICON_OPTIONS = [
  "Box",
  "FileText",
  "Cable",
  "ShieldCheck",
  "Smartphone",
  "Landmark",
  "SimCard",
  "Battery",
  "Camera",
  "Headphones",
  "Package",
  "Receipt",
  "Wifi",
];

interface Props {
  initialData?: any;
  onSubmit: (data: any, image: File | null) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const ConditionForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isLoading,
  isEdit,
}) => {
  const [assessmentId, setAssessmentId] = useState<string>(
    initialData?.step?.assessment?.id ?? "",
  );

  const [form, setForm] = useState({
    stepId: initialData?.stepId ?? "",
    parentOptionId: initialData?.parentOptionId ?? "",
    conditionType: initialData?.conditionType ?? "BOOLEAN",
    title: initialData?.title ?? "",
    subtitle: initialData?.subtitle ?? "",
    description: initialData?.description ?? "",
    finalConditionName: initialData?.finalConditionName ?? "",
    icon: initialData?.icon ?? "",
    isRequired: initialData?.isRequired ?? false,
    priority: initialData?.priority ?? 0,
    applicableFromDate: initialData?.applicableFromDate?.split("T")[0] ?? "",
    brandVisibilityStrategy: initialData?.brandVisibilityStrategy ?? "ALL",
  });

  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.image
      ? `${process.env.NEXT_PUBLIC_CDN_URL}/${initialData.image}`
      : null,
  );

  // 1. assessments
  const { data: assessmentData } = useQuery<any>(GET_ASSESSMENTS);
  const assessments = assessmentData?.getAssessments?.items ?? [];

  // 2. steps of the selected assessment only
  const { data: stepData, loading: stepsLoading } = useQuery<any>(GET_STEPS, {
    variables: { assessmentId },
    skip: !assessmentId,
  });
  const steps = assessmentId ? (stepData?.getSteps?.items ?? []) : [];

  const currentAssessment = assessments.find((a: any) => a.id === assessmentId);
  const currentStep = steps.find((s: any) => s.id === form.stepId);
  const categoryId =
    currentStep?.assessment?.categoryId ?? currentAssessment?.category?.id;

  const { data: brandData, loading: brandsLoading } = useQuery<any>(
    GET_BRANDS_BY_CATEGORY_ID,
    { variables: { categoryId }, skip: !categoryId },
  );
  const availableBrands = brandData?.getBrandsByCategoryId ?? [];

  const { data: optionsData } = useQuery<any>(GET_OPTIONS, {
    variables: { filter: { stepId: form.stepId, pageSize: 200 } },
    skip: !form.stepId,
  });
  const availableOptions = optionsData?.getOptions?.items ?? [];

  useEffect(() => {
    if (initialData) {
      setAssessmentId(initialData.step?.assessment?.id ?? "");
      setForm({
        stepId: initialData.stepId ?? "",
        parentOptionId: initialData.parentOptionId ?? "",
        conditionType: initialData.conditionType ?? "BOOLEAN",
        title: initialData.title ?? "",
        subtitle: initialData.subtitle ?? "",
        description: initialData.description ?? "",
        finalConditionName: initialData.finalConditionName ?? "",
        icon: initialData.icon ?? "",
        isRequired: initialData.isRequired ?? false,
        priority: initialData.priority ?? 0,
        applicableFromDate: initialData.applicableFromDate?.split("T")[0] ?? "",
        brandVisibilityStrategy: initialData.brandVisibilityStrategy ?? "ALL",
      });
      if (initialData.brandVisibility) {
        setSelectedBrandIds(
          initialData.brandVisibility
            .map((bv: any) => bv.brandId)
            .filter(Boolean),
        );
      }
      if (initialData.image) {
        setPreview(`${process.env.NEXT_PUBLIC_CDN_URL}/${initialData.image}`);
      }
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
    if (!form.title.trim()) return;
    if (!isEdit && !form.stepId) return;

    const brandVisibility =
      form.brandVisibilityStrategy !== "ALL"
        ? selectedBrandIds.map((id) => ({ brandId: id }))
        : [];

    const payload: any = {
      parentOptionId: form.parentOptionId || null,
      conditionType: form.conditionType,
      title: form.title,
      subtitle: form.subtitle || undefined,
      description: form.description || undefined,
      finalConditionName: form.finalConditionName || undefined,
      icon: form.icon || null, // empty = use the default icon
      isRequired: form.isRequired,
      priority: form.priority,
      applicableFromDate: form.applicableFromDate || undefined,
      brandVisibilityStrategy: form.brandVisibilityStrategy,
      brandVisibility,
    };

    if (!isEdit) {
      payload.stepId = form.stepId;
    }

    onSubmit(payload, image);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5 pb-4 border-b border-gray-100">
        <Label>Condition Image (Optional)</Label>
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
          label="Click to upload condition image"
          hint="PNG, JPG, WEBP · 512×512px recommended"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>
            Assessment <span className="text-red-500">*</span>
          </Label>
          <select
            value={assessmentId}
            onChange={(e) => {
              setAssessmentId(e.target.value);
              setForm((p) => ({ ...p, stepId: "", parentOptionId: "" }));
              setSelectedBrandIds([]);
            }}
            disabled={isEdit}
            className={`${selectClass} ${isEdit ? "opacity-60 bg-gray-50" : ""}`}
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

        <div className="flex flex-col gap-1.5">
          <Label>
            Step <span className="text-red-500">*</span>
          </Label>
          <select
            value={form.stepId}
            onChange={(e) => {
              setForm((p) => ({
                ...p,
                stepId: e.target.value,
                parentOptionId: "",
              }));
              setSelectedBrandIds([]);
            }}
            disabled={isEdit || !assessmentId}
            className={`${selectClass} ${
              isEdit || !assessmentId ? "opacity-60 bg-gray-50" : ""
            }`}
          >
            <option value="">
              {!assessmentId
                ? "Select assessment first"
                : stepsLoading
                  ? "Loading steps..."
                  : "Select step"}
            </option>
            {steps.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.stepNumber ? `${s.stepNumber}. ` : ""}
                {s.stepName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Parent Option (Make this a Popup)</Label>
          <select
            value={form.parentOptionId}
            onChange={(e) =>
              setForm((p) => ({ ...p, parentOptionId: e.target.value }))
            }
            disabled={!form.stepId}
            className={`${selectClass} ${!form.stepId ? "opacity-50" : ""}`}
          >
            <option value="">None (Normal Condition)</option>
            {availableOptions
              .filter((opt: any) => opt.id !== initialData?.id)
              .map((opt: any) => (
                <option key={opt.id} value={opt.id}>
                  {opt.condition?.title} → {opt.label}
                </option>
              ))}
          </select>
          <p className="text-[11px] text-gray-500">
            If you select an option, this condition will open as a popup when
            that option is clicked.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Is your device switching on?"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Condition Type</Label>
          <select
            value={form.conditionType}
            onChange={(e) =>
              setForm((p) => ({ ...p, conditionType: e.target.value }))
            }
            className={selectClass}
          >
            {CONDITION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
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

        <div className="flex flex-col gap-1.5">
          <Label>Icon (Optional)</Label>
          <select
            value={form.icon}
            onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
            className={selectClass}
          >
            <option value="">Default</option>
            {ICON_OPTIONS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-500">
            Shown on the accessories tiles. Leave as Default to use the
            automatic icon.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Required</Label>
          <label className="flex h-9 cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isRequired}
              onChange={(e) =>
                setForm((p) => ({ ...p, isRequired: e.target.checked }))
              }
              className="h-4 w-4 rounded border-gray-300 text-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]"
            />
            Customer cannot skip this question
          </label>
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
          <Label>Applicable From Date</Label>
          <Input
            type="date"
            value={form.applicableFromDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, applicableFromDate: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
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
            <option value="INCLUDE">Include Specific Brands</option>
            <option value="EXCLUDE">Exclude Specific Brands</option>
          </select>
        </div>
      </div>

      {form.brandVisibilityStrategy !== "ALL" && (
        <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <Label>
            Select Brands to{" "}
            {form.brandVisibilityStrategy === "INCLUDE" ? "Include" : "Exclude"}
          </Label>
          {!form.stepId ? (
            <p className="text-sm text-gray-500">Please select a step first.</p>
          ) : brandsLoading ? (
            <p className="text-sm text-gray-500">Loading brands...</p>
          ) : availableBrands.length === 0 ? (
            <p className="text-sm text-gray-500">
              No brands found for this category.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
              {availableBrands.map((brand: any) => (
                <label
                  key={brand.id}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrandIds.includes(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]"
                  />
                  {brand.name}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button size="md" onClick={handleSubmit} disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEdit
              ? "Update Condition"
              : "Create Condition"}
        </Button>
      </div>
    </div>
  );
};
