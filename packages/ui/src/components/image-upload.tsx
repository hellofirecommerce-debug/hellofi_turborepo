"use client";
import React from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  preview: string | null;
  file: File | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  label?: string;
  hint?: string;
  required?: boolean;
}

export function ImageUpload({
  preview,
  file,
  onFileChange,
  onRemove,
  label,
  hint = "PNG, JPG, WEBP · 100×100px",
  required = false,
}: ImageUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onFileChange(f);
  };

  if (!preview) {
    return (
      <label className="cursor-pointer group">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <div className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors group-hover:border-[rgb(33,76,123)] group-hover:bg-blue-50/30">
          <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[rgb(33,76,123)] transition-colors">
            <ImagePlus size={28} />
            <div className="text-center">
              <p className="text-sm font-medium">
                {label || "Click to upload image"}
              </p>
              <p className="text-xs mt-0.5">{hint}</p>
            </div>
          </div>
        </div>
      </label>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
      {/* Preview */}
      <div className="w-[80px] h-[80px] rounded-lg overflow-hidden border border-gray-200 shrink-0">
        <img
          src={preview}
          alt="preview"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info + actions */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {file ? (
          <>
            <p className="text-sm font-medium text-gray-700 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-400">
              {`${(file.size / 1024).toFixed(1)} KB`}
            </p>
          </>
        ) : (
          <p className="text-sm font-medium text-gray-700">Current image</p>
        )}

        {/* Actions — wrap on mobile */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer shrink-0">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-white transition-colors cursor-pointer">
              <ImagePlus size={12} />
              Change
            </span>
          </label>

          {file && (
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
