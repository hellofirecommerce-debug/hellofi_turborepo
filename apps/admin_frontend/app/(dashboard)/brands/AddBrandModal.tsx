"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Label, ImageUpload } from "@repo/ui";
import { Check } from "lucide-react";
import { Brand, CategoryOption } from "./types";

interface BrandCategorySelection {
  categoryId: string;
  priority: number;
  status: "ACTIVE" | "INACTIVE";
}

interface AddBrandForm {
  name: string;
  seoName: string;
  image: File | null;
  brandCategories: BrandCategorySelection[];
}

const initialForm: AddBrandForm = {
  name: "",
  seoName: "",
  image: null,
  brandCategories: [],
};

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddBrandForm) => void;
  isLoading?: boolean;
  editData?: Brand | null;
  categories: CategoryOption[];
}

export const AddBrandModal: React.FC<AddBrandModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData = null,
  categories,
}) => {
  const [form, setForm] = useState<AddBrandForm>(initialForm);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        seoName: editData.seoName,
        image: null,
        brandCategories: editData.brandCategories.map((bc) => ({
          categoryId: bc.categoryId,
          priority: bc.priority,
          status: bc.status as "ACTIVE" | "INACTIVE",
        })),
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

  const handleChange = (key: keyof AddBrandForm, value: string) => {
    if (key === "name") {
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

  const toggleCategory = (id: string) => {
    setForm((prev) => {
      const exists = prev.brandCategories.find((bc) => bc.categoryId === id);
      if (exists) {
        return {
          ...prev,
          brandCategories: prev.brandCategories.filter(
            (bc) => bc.categoryId !== id,
          ),
        };
      }
      return {
        ...prev,
        brandCategories: [
          ...prev.brandCategories,
          { categoryId: id, priority: 0, status: "ACTIVE" },
        ],
      };
    });
  };

  const updatePriority = (id: string, priority: number) => {
    setForm((prev) => ({
      ...prev,
      brandCategories: prev.brandCategories.map((bc) =>
        bc.categoryId === id ? { ...bc, priority } : bc,
      ),
    }));
  };

  const updateStatus = (id: string, status: "ACTIVE" | "INACTIVE") => {
    setForm((prev) => ({
      ...prev,
      brandCategories: prev.brandCategories.map((bc) =>
        bc.categoryId === id ? { ...bc, status } : bc,
      ),
    }));
  };

  const handleSubmit = () => {
    if (!editData && !form.image) return;
    onSubmit(form);
  };

  const handleClose = () => {
    setForm(initialForm);
    setPreview(null);
    onClose();
  };

  const isEdit = !!editData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Brand" : "Add Brand"}
      description={
        isEdit
          ? "Update brand details"
          : "Fill in the details to add a new brand"
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
            {isLoading ? "Saving..." : isEdit ? "Update Brand" : "Save Brand"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Image */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Brand Logo
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
            label="Click to upload logo"
            hint="PNG, JPG, WEBP · 100×100px"
          />
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. Samsung"
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
            placeholder="e.g. samsung"
            value={form.seoName}
            onChange={(e) => handleChange("seoName", e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Categories <span className="text-red-500">*</span>
            <span className="text-xs text-gray-400 ml-2 font-normal">
              {form.brandCategories.length} selected
            </span>
          </Label>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => {
              const selected = form.brandCategories.find(
                (bc) => bc.categoryId === cat.id,
              );
              return (
                <div
                  key={cat.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Toggle row */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors ${
                      selected
                        ? "bg-[rgb(33,76,123)]/10 text-[rgb(33,76,123)] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        selected
                          ? "bg-[rgb(33,76,123)] border-[rgb(33,76,123)]"
                          : "border-gray-300"
                      }`}
                    >
                      {selected && <Check size={10} className="text-white" />}
                    </span>
                    {cat.name}
                  </button>

                  {/* Priority + Status — only when selected */}
                  {selected && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-gray-50 border-t border-gray-100">
                      {/* Priority */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 shrink-0 w-14">
                          Priority
                        </span>
                        <Input
                          type="number"
                          min={0}
                          value={selected.priority}
                          onChange={(e) =>
                            updatePriority(cat.id, Number(e.target.value))
                          }
                          className="h-8 w-24 text-xs"
                        />
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 shrink-0 w-14">
                          Status
                        </span>
                        <div className="flex items-center gap-1">
                          {(["ACTIVE", "INACTIVE"] as const).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateStatus(cat.id, s)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                                selected.status === s
                                  ? s === "ACTIVE"
                                    ? "bg-green-50 border-green-300 text-green-700"
                                    : "bg-red-50 border-red-300 text-red-700"
                                  : "border-gray-200 text-gray-400 hover:bg-gray-100"
                              }`}
                            >
                              {s === "ACTIVE" ? "Active" : "Inactive"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
