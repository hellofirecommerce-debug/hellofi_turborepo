"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Label, ImageUpload } from "@repo/ui";
import { ImagePlus, X } from "lucide-react";
import { CreateCategoryInput } from "@repo/validations";
import { Category } from "./types";

interface AddCategoryForm extends CreateCategoryInput {
  image: File | null;
  status: "ACTIVE" | "INACTIVE";
}

const initialForm: AddCategoryForm = {
  name: "",
  seoName: "",
  categoryType: "SELL",
  priority: 0,
  image: null,
  status: "ACTIVE",
};

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddCategoryForm) => void;
  isLoading?: boolean;
  editData?: Category | null;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData = null,
}) => {
  const [form, setForm] = useState<AddCategoryForm>(initialForm);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        seoName: editData.seoName,
        categoryType: editData.categoryType as "SELL" | "BUY" | "SELL_AND_BUY",
        priority: editData.priority,
        image: null,
        status: editData.status,
      });
      setPreview(
        editData.image
          ? `${process.env.NEXT_PUBLIC_CDN_URL}/${editData.image}`
          : null,
      );
    } else {
      setForm(initialForm);
      setPreview(null);
    }
  }, [editData, isOpen]);

  const handleChange = (key: keyof AddCategoryForm, value: string | number) => {
    if (key === "name" && typeof value === "string") {
      setForm((prev) => ({
        ...prev,
        name: value,
        seoName: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const handleSubmit = () => {
    // for add — image required
    // for edit — image optional (keep existing if not changed)
    if (!editData && !form.image) return;
    onSubmit(form);
  };

  const handleClose = () => {
    setForm(initialForm);
    setPreview(null);
    onClose();
  };

  const categoryTypeOptions = [
    { label: "Sell", value: "SELL" },
    { label: "Buy", value: "BUY" },
    { label: "Sell & Buy", value: "SELL_AND_BUY" },
  ];

  const isEdit = !!editData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Category" : "Add Category"}
      description={
        isEdit
          ? "Update the category details"
          : "Fill in the details to create a new category"
      }
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEdit
                ? "Update Category"
                : "Save Category"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Image upload */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Category Image
            {!isEdit && <span className="text-red-500 ml-1">*</span>}
            <span className="text-xs text-gray-400 ml-2 font-normal">
              100×100px recommended
            </span>
          </Label>
          <ImageUpload
            preview={preview}
            file={form.image}
            onFileChange={(file) => {
              setForm((prev) => ({ ...prev, image: file }));
              setPreview(URL.createObjectURL(file));
            }}
            onRemove={() => {
              setForm((prev) => ({ ...prev, image: null }));
              setPreview(null);
            }}
            label="Click to upload image"
            hint="PNG, JPG, WEBP · 100×100px"
          />
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Mobile Phones"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* SEO Name */}
        <div className="flex flex-col gap-1.5">
          <Label>
            SEO Name <span className="text-red-500">*</span>
            <span className="text-xs text-gray-400 ml-2 font-normal">
              auto-generated
            </span>
          </Label>
          <Input
            placeholder="e.g. mobile-phones"
            value={form.seoName}
            onChange={(e) => handleChange("seoName", e.target.value)}
          />
        </div>

        {/* Category Type */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Category Type <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {categoryTypeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChange("categoryType", opt.value)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  form.categoryType === opt.value
                    ? "bg-[rgb(33,76,123)]/10 border-[rgb(33,76,123)] text-[rgb(33,76,123)]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>
              Priority <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              placeholder="e.g. 1"
              min={0}
              value={form.priority === 0 ? "" : String(form.priority)}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  priority: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <div className="flex items-center gap-2 h-9">
              {(["ACTIVE", "INACTIVE"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-colors ${
                    form.status === s
                      ? s === "ACTIVE"
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-red-50 border-red-300 text-red-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      s === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {s === "ACTIVE" ? "Active" : "Inactive"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
