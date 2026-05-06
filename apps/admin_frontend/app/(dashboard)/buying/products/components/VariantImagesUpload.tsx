"use client";
import React, { useState, useRef } from "react";
import { Button, Label } from "@repo/ui";
import { X, Star, GripVertical } from "lucide-react";

interface VariantImageEntry {
  file: File;
  preview: string;
}

interface Props {
  variantIndex: number;
  variantLabel: string;
  images: VariantImageEntry[];
  defaultImageIndex: number;
  onImagesChange: (images: VariantImageEntry[]) => void;
  onDefaultChange: (index: number) => void;
}

export const VariantImagesUpload: React.FC<Props> = ({
  variantIndex,
  variantLabel,
  images,
  defaultImageIndex,
  onImagesChange,
  onDefaultChange,
}) => {
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newEntries = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    onImagesChange([...images, ...newEntries]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
    if (defaultImageIndex === index) {
      onDefaultChange(0);
    } else if (defaultImageIndex > index) {
      onDefaultChange(defaultImageIndex - 1);
    }
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverIndex.current = index;
  };

  const handleDragEnd = () => {
    if (
      dragIndex.current === null ||
      dragOverIndex.current === null ||
      dragIndex.current === dragOverIndex.current
    ) {
      dragIndex.current = null;
      dragOverIndex.current = null;
      return;
    }

    const reordered = [...images];
    const moved = reordered.splice(dragIndex.current, 1)[0]; // ← [0] gives VariantImageEntry | undefined
    if (!moved) return; // ← guard against undefined

    reordered.splice(dragOverIndex.current, 0, moved);

    let newDefault = defaultImageIndex;
    if (defaultImageIndex === dragIndex.current) {
      newDefault = dragOverIndex.current;
    } else if (
      dragIndex.current < defaultImageIndex &&
      dragOverIndex.current >= defaultImageIndex
    ) {
      newDefault = defaultImageIndex - 1;
    } else if (
      dragIndex.current > defaultImageIndex &&
      dragOverIndex.current <= defaultImageIndex
    ) {
      newDefault = defaultImageIndex + 1;
    }

    onImagesChange(reordered);
    onDefaultChange(newDefault);

    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>
        {variantLabel} Images <span className="text-red-500">*</span>
        <span className="text-xs text-gray-400 ml-2 font-normal">
          Click ★ to set default · Drag to reorder priority
        </span>
      </Label>

      <div className="flex flex-wrap gap-2">
        {images.map((entry, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden group cursor-grab active:cursor-grabbing ${
              i === defaultImageIndex
                ? "border-[rgb(33,76,123)] ring-2 ring-[rgb(33,76,123)]/20"
                : "border-gray-200"
            }`}
          >
            <img
              src={entry.preview}
              alt={`variant-${variantIndex}-img-${i}`}
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Priority badge */}
            <div className="absolute top-1 left-1 bg-black/50 text-white text-[9px] rounded px-1">
              {i + 1}
            </div>

            {/* Drag handle */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical size={14} className="text-white drop-shadow" />
            </div>

            {/* Default star */}
            <Button
              type="button"
              onClick={() => onDefaultChange(i)}
              className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                i === defaultImageIndex
                  ? "bg-[rgb(33,76,123)] text-white"
                  : "bg-white/80 text-gray-400 hover:text-[rgb(33,76,123)]"
              }`}
            >
              <Star
                size={11}
                fill={i === defaultImageIndex ? "currentColor" : "none"}
              />
            </Button>

            {/* Remove */}
            <Button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute bottom-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={10} />
            </Button>

            {i === defaultImageIndex && (
              <div className="absolute bottom-0 left-0 right-0 bg-[rgb(33,76,123)]/80 text-white text-center text-[9px] py-0.5">
                Default
              </div>
            )}
          </div>
        ))}

        {/* Upload button */}
        <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[rgb(33,76,123)] hover:bg-blue-50 transition-colors">
          <span className="text-xl text-gray-400">+</span>
          <span className="text-xs text-gray-400">Add</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {images.length === 0 && (
        <p className="text-xs text-red-500">At least one image required</p>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-400">
          Priority: left to right · Image 1 is highest priority
        </p>
      )}
    </div>
  );
};
