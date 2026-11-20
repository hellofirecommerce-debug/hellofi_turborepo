"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Input, Label, Button, ImageUpload } from "@repo/ui";
import { GET_CONDITIONS } from "../../../../../lib/graphql/queries/condition.queries";
import {
  GET_ASSESSMENTS,
  GET_STEPS,
} from "../../../../../lib/graphql/queries/assessment.queries";
import { BrandPicker } from "../../../../../components/ui/BrandPicker";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

const ACTIONS = ["NONE", "INCREMENT", "DECREMENT", "REDIRECT"];
const SCORE_TYPES = ["PER", "RUPPEE", "MUL"];

// stored value can be a full URL or a CDN path
const toImageUrl = (raw?: string | null): string | null => {
  if (!raw) return null;
  if (/^(https?:)?\/\//.test(raw) || raw.startsWith("data:")) return raw;
  const base = (process.env.NEXT_PUBLIC_CDN_URL || "").replace(/\/+$/, "");
  return `${base}/${raw.replace(/^\/+/, "")}`;
};

const idsFrom = (list?: { brandId?: string | null }[]): string[] =>
  (list ?? []).map((bv) => bv.brandId).filter(Boolean) as string[];

interface Props {
  initialData?: any;
  onSubmit: (
    data: any,
    image: File | null,
    removeImage: boolean,
    resize: boolean,
  ) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const OptionForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isLoading,
  isEdit,
}) => {
  const [form, setForm] = useState({
    conditionId: initialData?.conditionId ?? "",
    label: initialData?.label ?? "",
    action: initialData?.action ?? "NONE",
    score: initialData?.score ?? 0,
    scoreType: initialData?.scoreType ?? "PER",
    isRedirect: initialData?.isRedirect ?? false,
    redirectTo: initialData?.redirectTo ?? "",
    priority: initialData?.priority ?? 0,
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    brandVisibilityStrategy: initialData?.brandVisibilityStrategy ?? "ALL",
  });

  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(
    idsFrom(initialData?.brandVisibility),
  );

  // UI-only filters, never sent to the backend
  const [assessmentId, setAssessmentId] = useState<string>(
    initialData?.condition?.step?.assessment?.id ?? "",
  );
  const [stepId, setStepId] = useState<string>(
    initialData?.condition?.step?.id ?? "",
  );

  const [shouldResize, setShouldResize] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [preview, setPreview] = useState<string | null>(
    toImageUrl(initialData?.image),
  );

  // 1. assessments
  const { data: assessmentData } = useQuery<any>(GET_ASSESSMENTS);
  const assessments = assessmentData?.getAssessments?.items ?? [];

  // 2. steps of the chosen assessment
  const { data: stepData, loading: stepsLoading } = useQuery<any>(GET_STEPS, {
    variables: { assessmentId },
    skip: !assessmentId,
  });
  const steps = assessmentId ? (stepData?.getSteps?.items ?? []) : [];

  // 3. conditions of the chosen step
  const { data: condData, loading: condLoading } = useQuery<any>(
    GET_CONDITIONS,
    {
      variables: { filter: { stepId, pageSize: 500 } },
      skip: !stepId,
    },
  );
  const conditions = stepId ? (condData?.getConditions?.items ?? []) : [];

  useEffect(() => {
    if (initialData) {
      setForm({
        conditionId: initialData.conditionId ?? "",
        label: initialData.label ?? "",
        action: initialData.action ?? "NONE",
        score: initialData.score ?? 0,
        scoreType: initialData.scoreType ?? "PER",
        isRedirect: initialData.isRedirect ?? false,
        redirectTo: initialData.redirectTo ?? "",
        priority: initialData.priority ?? 0,
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        brandVisibilityStrategy: initialData.brandVisibilityStrategy ?? "ALL",
      });

      setSelectedBrandIds(idsFrom(initialData.brandVisibility));
      setAssessmentId(initialData.condition?.step?.assessment?.id ?? "");
      setStepId(initialData.condition?.step?.id ?? "");

      setPreview(toImageUrl(initialData.image));
      setImage(null);
      setRemoveImage(false);
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
    if (!form.label.trim()) return;
    if (!form.conditionId) return;

    const brandVisibility =
      form.brandVisibilityStrategy !== "ALL"
        ? selectedBrandIds.map((id) => ({ brandId: id }))
        : [];

    const payload: any = {
      conditionId: form.conditionId,
      label: form.label,
      action: form.action,
      score: form.score,
      scoreType: form.scoreType,
      isRedirect: form.isRedirect,
      redirectTo: form.redirectTo || undefined,
      priority: form.priority,
      title: form.title || undefined,
      description: form.description || undefined,
      brandVisibilityStrategy: form.brandVisibilityStrategy,
      brandVisibility,
    };

    // a newly picked file replaces the old one, so no separate remove needed
    onSubmit(payload, image, image ? false : removeImage, shouldResize);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5 pb-4 border-b border-gray-100">
        <Label>Option Icon (Optional)</Label>
        <ImageUpload
          preview={preview}
          file={image}
          onFileChange={(file) => {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setRemoveImage(false);
          }}
          onRemove={() => {
            setImage(null);
            setPreview(null);
            // only matters when an image is already saved on the server
            setRemoveImage(!!initialData?.image);
          }}
          label="Click to upload icon/image"
          hint="PNG, SVG, WEBP · 128×128px recommended"
        />

        {isEdit && initialData?.image && (
          <p className="text-[11px] text-gray-500">
            {removeImage
              ? "Current image will be removed when you save. Upload a new one to replace it."
              : image
                ? "New image will replace the current one when you save."
                : "Current image is shown above. Remove it, or upload a new one to replace it."}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            id="resize"
            checked={shouldResize}
            onChange={(e) => setShouldResize(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[rgb(33,76,123)]"
          />
          <label
            htmlFor="resize"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Resize image to 128×128px (uncheck to upload original)
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>
            Assessment <span className="text-red-500">*</span>
          </Label>
          <select
            value={assessmentId}
            onChange={(e) => {
              setAssessmentId(e.target.value);
              setStepId("");
              setForm((p) => ({ ...p, conditionId: "" }));
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

        <div className="flex flex-col gap-1.5">
          <Label>
            Step <span className="text-red-500">*</span>
          </Label>
          <select
            value={stepId}
            onChange={(e) => {
              setStepId(e.target.value);
              setForm((p) => ({ ...p, conditionId: "" }));
            }}
            disabled={!assessmentId}
            className={`${selectClass} ${!assessmentId ? "opacity-60 bg-gray-50" : ""}`}
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

        <div className="flex flex-col gap-1.5">
          <Label>
            Condition <span className="text-red-500">*</span>
          </Label>
          <select
            value={form.conditionId}
            onChange={(e) =>
              setForm((p) => ({ ...p, conditionId: e.target.value }))
            }
            disabled={!stepId}
            className={`${selectClass} ${!stepId ? "opacity-60 bg-gray-50" : ""}`}
          >
            <option value="">
              {!stepId
                ? "Select step first"
                : condLoading
                  ? "Loading conditions..."
                  : "Select condition"}
            </option>
            {conditions.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>
            Label <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Yes"
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Input
            placeholder="Shown under the label"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Action</Label>
          <select
            value={form.action}
            onChange={(e) => setForm((p) => ({ ...p, action: e.target.value }))}
            className={selectClass}
          >
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Score</Label>
          <Input
            type="number"
            value={form.score}
            onChange={(e) =>
              setForm((p) => ({ ...p, score: Number(e.target.value) }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Score Type</Label>
          <select
            value={form.scoreType}
            onChange={(e) =>
              setForm((p) => ({ ...p, scoreType: e.target.value }))
            }
            className={selectClass}
          >
            {SCORE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
            <option value="EXCLUDE">Hide for specific brands</option>
          </select>
        </div>
      </div>

      <BrandPicker
        assessmentId={assessmentId}
        strategy={form.brandVisibilityStrategy}
        selectedIds={selectedBrandIds}
        onToggle={toggleBrand}
      />

      <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isRedirect"
            checked={form.isRedirect}
            onChange={(e) =>
              setForm((p) => ({ ...p, isRedirect: e.target.checked }))
            }
            className="w-4 h-4 rounded border-gray-300 text-[rgb(33,76,123)]"
          />
          <label
            htmlFor="isRedirect"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Redirect to Quote Page if selected?
          </label>
        </div>

        {form.isRedirect && (
          <div className="flex flex-col gap-1.5">
            <Label>
              Redirect URL <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. /quote-page"
              value={form.redirectTo}
              onChange={(e) =>
                setForm((p) => ({ ...p, redirectTo: e.target.value }))
              }
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button size="md" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update Option" : "Create Option"}
        </Button>
      </div>
    </div>
  );
};
