"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Input, Label, Button } from "@repo/ui";
import { GET_CATEGORIES } from "../../../../../lib/graphql/queries/category.queries";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

interface Props {
  initialData?: {
    id?: string;
    name: string;
    description?: string;
    categoryId: string;
  };
  onSubmit: (data: {
    name: string;
    description?: string;
    categoryId: string;
  }) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const AssessmentForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isLoading,
  isEdit,
}) => {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    categoryId: initialData?.categoryId ?? "",
  });

  const { data: catData } = useQuery<any>(GET_CATEGORIES);
  const categories = catData?.getCategories ?? [];

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description ?? "",
        categoryId: initialData.categoryId,
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (!isEdit && !form.categoryId) return;
    onSubmit(form);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder="e.g. Mobile Device Assessment"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          Category <span className="text-red-500">*</span>
        </Label>
        <select
          value={form.categoryId}
          onChange={(e) =>
            setForm((p) => ({ ...p, categoryId: e.target.value }))
          }
          disabled={isEdit}
          className={`${selectClass} ${isEdit ? "opacity-60" : ""}`}
        >
          <option value="">Select category</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <Input
          placeholder="Optional"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
        />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button size="md" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
