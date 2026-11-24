"use client";
import React from "react";
import { FileUp, FileText, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  file: File | null;
  existingUrl?: string | null;
  existingName?: string | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  onRemoveExisting?: () => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
}

export function FileUpload({
  file,
  existingUrl,
  existingName,
  onFileChange,
  onRemove,
  onRemoveExisting,
  accept = "application/pdf,image/jpeg,image/png,image/webp",
  maxSizeMB = 10,
  label,
  hint = "PDF, JPG, PNG, WEBP · max 10 MB",
}: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = ""; // lets the same file be picked again
    if (!f) return;

    if (f.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File must be ${maxSizeMB} MB or smaller`);
      return;
    }
    if (f.size === 0) {
      toast.error("File is empty");
      return;
    }
    onFileChange(f);
  };

  const pickButton = (text: string) => (
    <label className="cursor-pointer shrink-0">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-white transition-colors cursor-pointer">
        <FileUp size={12} />
        {text}
      </span>
    </label>
  );

  // 1) a new file is selected
  if (file) {
    return (
      <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
        <div className="w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0 text-[rgb(33,76,123)]">
          <FileText size={22} />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div>
            <p className="text-sm font-medium text-gray-700 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-400">
              {`${(file.size / 1024).toFixed(1)} KB`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pickButton("Change")}
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2) a saved file exists
  if (existingUrl) {
    return (
      <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
        <div className="w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0 text-green-600">
          <FileText size={22} />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div>
            <p className="text-sm font-medium text-gray-700 truncate">
              {existingName || "Original bill"}
            </p>
            <p className="text-xs text-gray-400">Currently saved</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={existingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-white transition-colors"
            >
              <ExternalLink size={12} />
              View
            </a>
            {pickButton("Replace")}
            {onRemoveExisting && (
              <button
                type="button"
                onClick={onRemoveExisting}
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

  // 3) nothing yet
  return (
    <label className="cursor-pointer group">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors group-hover:border-[rgb(33,76,123)] group-hover:bg-blue-50/30">
        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[rgb(33,76,123)] transition-colors">
          <FileUp size={26} />
          <div className="text-center">
            <p className="text-sm font-medium">
              {label || "Click to upload file"}
            </p>
            <p className="text-xs mt-0.5">{hint}</p>
          </div>
        </div>
      </div>
    </label>
  );
}
