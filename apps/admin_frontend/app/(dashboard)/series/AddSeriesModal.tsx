"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Label } from "@repo/ui";
import { Series, BrandOption, CategoryOption } from "./types";
import { CreateSeriesInput } from "@repo/validations";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

const initialForm: CreateSeriesInput = {
  brandId: "",
  categoryId: "",
  seriesName: "",
  status: "ACTIVE",
  priority: 0,
};

interface AddSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSeriesInput) => void;
  isLoading?: boolean;
  editData?: Series | null;
  brands: BrandOption[];
  categories: CategoryOption[];
}

export const AddSeriesModal: React.FC<AddSeriesModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData = null,
  brands,
  categories,
}) => {
  const [form, setForm] = useState<CreateSeriesInput>(initialForm);

  useEffect(() => {
    if (editData) {
      setForm({
        brandId: editData.brandId,
        categoryId: editData.categoryId,
        seriesName: editData.seriesName,
        status: editData.status,
        priority: editData.priority,
      });
    } else {
      setForm(initialForm);
    }
  }, [editData, isOpen]);

  const isEdit = !!editData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Series" : "Add Series"}
      description={
        isEdit
          ? "Update series details"
          : "Fill in the details to add a new series"
      }
      size="md"
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSubmit(form)} disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Series" : "Save Series"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>
            Category <span className="text-red-500">*</span>
          </Label>
          <select
            title="category"
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, categoryId: e.target.value }))
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
            className={selectClass}
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>
            Series Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Galaxy S Series"
            value={form.seriesName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, seriesName: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Priority</Label>
          <Input
            type="number"
            min={0}
            value={form.priority}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, priority: Number(e.target.value) }))
            }
          />
        </div>

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
    </Modal>
  );
};
