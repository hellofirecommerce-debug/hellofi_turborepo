"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Label } from "@repo/ui";
import { X, Upload } from "lucide-react";
import { BuyCategoryBanner } from "./types";

export interface AddBannerForm {
  alt: string;
  redirectUrl: string;
  placement: string;
  priority: number;
  lgFile: File | null;
  smFile: File | null;
}

const initialForm: AddBannerForm = {
  alt: "",
  redirectUrl: "",
  placement: "BUY_MOBILE",
  priority: 0,
  lgFile: null,
  smFile: null,
};

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddBannerForm) => void;
  isLoading?: boolean;
  editData?: BuyCategoryBanner | null;
}

const placementOptions = [
  { label: "Buy — Mobile", value: "BUY_MOBILE" },
  { label: "Buy — Laptop", value: "BUY_LAPTOP" },
  { label: "Buy — Tablet", value: "BUY_TABLET" },
  { label: "Buy — Smartwatch", value: "BUY_SMARTWATCH" },
  { label: "Buy — Accessories", value: "BUY_ACCESSORIES" },
  { label: "Buy — All", value: "BUY_ALL" },
];

export const AddBannerModal: React.FC<AddBannerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData = null,
}) => {
  const [form, setForm] = useState<AddBannerForm>(initialForm);
  const [lgPreview, setLgPreview] = useState<string | null>(null);
  const [smPreview, setSmPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!editData;

  // pre-fill on edit, reset on create
  // pre-fill on edit, reset on create
  useEffect(() => {
    if (editData) {
      setForm({
        alt: editData.alt,
        redirectUrl: editData.redirectUrl ?? "",
        placement: editData.placement,
        priority: editData.priority,
        lgFile: null,
        smFile: null,
      });
      setLgPreview(
        editData.lg
          ? `${process.env.NEXT_PUBLIC_CDN_URL}/${editData.lg}`
          : null,
      );
      setSmPreview(
        editData.sm
          ? `${process.env.NEXT_PUBLIC_CDN_URL}/${editData.sm}`
          : null,
      );
    } else {
      setForm(initialForm);
      setLgPreview(null);
      setSmPreview(null);
    }
    setErrors({});
  }, [editData, isOpen]);

  const handleChange = (key: keyof AddBannerForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleLgImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, lgFile: file }));
    setLgPreview(URL.createObjectURL(file));
    if (errors.lgFile) setErrors((prev) => ({ ...prev, lgFile: "" }));
  };

  const handleSmImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, smFile: file }));
    setSmPreview(URL.createObjectURL(file));
    if (errors.smFile) setErrors((prev) => ({ ...prev, smFile: "" }));
  };

  const removeLg = () => {
    setForm((prev) => ({ ...prev, lgFile: null }));
    setLgPreview(null);
  };

  const removeSm = () => {
    setForm((prev) => ({ ...prev, smFile: null }));
    setSmPreview(null);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.alt.trim()) newErrors.alt = "Alt text is required";
    if (!form.placement) newErrors.placement = "Placement is required";
    // on create both images required; on edit they're optional (keep existing)
    if (!isEdit && !form.lgFile) newErrors.lgFile = "Desktop image is required";
    if (!isEdit && !form.smFile) newErrors.smFile = "Mobile image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(form); // parent closes on success
  };

  const handleClose = () => {
    setForm(initialForm);
    setLgPreview(null);
    setSmPreview(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Banner" : "Add Banner"}
      description={
        isEdit
          ? "Update the banner details"
          : "Upload desktop and mobile banner images with a placement"
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
            {isLoading ? "Saving..." : isEdit ? "Update Banner" : "Save Banner"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Desktop image */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Desktop Image
            {!isEdit && <span className="text-red-500 ml-1">*</span>}
            <span className="text-xs text-gray-400 ml-2 font-normal">
              1600×680px recommended
            </span>
          </Label>

          {!lgPreview ? (
            <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
              <Upload size={22} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                Click to upload desktop banner
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLgImage}
              />
            </label>
          ) : (
            <div className="relative w-full aspect-[1600/680] rounded-lg overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lgPreview}
                alt="Desktop preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                title="Remove desktop image"
                aria-label="Remove desktop image"
                onClick={removeLg}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 cursor-pointer"
              >
                <X size={15} className="text-white" />
              </button>
            </div>
          )}
          {errors.lgFile && (
            <span className="text-xs text-red-500">{errors.lgFile}</span>
          )}
        </div>

        {/* Mobile image */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Mobile Image
            {!isEdit && <span className="text-red-500 ml-1">*</span>}
            <span className="text-xs text-gray-400 ml-2 font-normal">
              800×400px recommended
            </span>
          </Label>

          {!smPreview ? (
            <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
              <Upload size={22} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                Click to upload mobile banner
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSmImage}
              />
            </label>
          ) : (
            <div className="relative w-1/2 aspect-[800/400] rounded-lg overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={smPreview}
                alt="Mobile preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                title="Remove mobile image"
                aria-label="Remove mobile image"
                onClick={removeSm}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 cursor-pointer"
              >
                <X size={15} className="text-white" />
              </button>
            </div>
          )}
          {errors.smFile && (
            <span className="text-xs text-red-500">{errors.smFile}</span>
          )}
        </div>

        {/* Alt text */}
        <div className="flex flex-col gap-1.5">
          <Label>
            Alt Text<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            value={form.alt}
            onChange={(e) => handleChange("alt", e.target.value)}
            placeholder="e.g. Best Selling Mobiles"
          />
          {errors.alt && (
            <span className="text-xs text-red-500">{errors.alt}</span>
          )}
        </div>

        {/* Placement */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="banner-placement">
            Placement<span className="text-red-500 ml-1">*</span>
          </Label>
          <select
            id="banner-placement"
            value={form.placement}
            onChange={(e) => handleChange("placement", e.target.value)}
            aria-label="Banner placement"
            title="Banner placement"
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400 cursor-pointer"
          >
            {placementOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.placement && (
            <span className="text-xs text-red-500">{errors.placement}</span>
          )}
        </div>

        {/* Redirect URL */}
        <div className="flex flex-col gap-1.5">
          <Label>Redirect URL</Label>
          <Input
            value={form.redirectUrl}
            onChange={(e) => handleChange("redirectUrl", e.target.value)}
            placeholder="/buy-used-mobile-phones"
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <Label>Priority</Label>
          <Input
            type="number"
            value={form.priority}
            onChange={(e) =>
              handleChange("priority", Number(e.target.value) || 0)
            }
            placeholder="0"
          />
        </div>
      </div>
    </Modal>
  );
};
