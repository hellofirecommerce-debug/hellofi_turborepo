"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Input, Label, Button, ImageUpload } from "@repo/ui";
import { GET_CONDITIONS } from "../../../../../lib/graphql/queries/condition.queries";

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
  });

  const [shouldResize, setShouldResize] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [preview, setPreview] = useState<string | null>(
    toImageUrl(initialData?.image),
  );

  const { data: condData } = useQuery<any>(GET_CONDITIONS, {
    variables: { filter: { pageSize: 500 } },
  });
  const conditions = condData?.getConditions?.items ?? [];

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
      });

      setPreview(toImageUrl(initialData.image));
      setImage(null);
      setRemoveImage(false);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!form.label.trim()) return;
    if (!form.conditionId) return;

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

      <div className="flex flex-col gap-1.5">
        <Label>
          Condition <span className="text-red-500">*</span>
        </Label>
        <select
          value={form.conditionId}
          onChange={(e) =>
            setForm((p) => ({ ...p, conditionId: e.target.value }))
          }
          className={selectClass}
        >
          <option value="">Select condition</option>
          {conditions.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.title} — {c.step?.stepName}
            </option>
          ))}
        </select>
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
      </div>

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
