"use client";
import React from "react";
import { FileUp, FileText, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export interface ExistingFile {
  id: string;
  name: string;
  url: string | null;
}

interface FilesUploadProps {
  files: File[];
  existing?: ExistingFile[];
  onAdd: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
  onRemoveExisting?: (id: string) => void;
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  label?: string;
  hint?: string;
}

export function FilesUpload({
  files,
  existing = [],
  onAdd,
  onRemoveNew,
  onRemoveExisting,
  accept = "application/pdf,image/jpeg,image/png,image/webp",
  maxSizeMB = 10,
  maxFiles = 10,
  label = "Click to upload files",
  hint = "PDF, JPG, PNG, WEBP · max 10 MB each",
}: FilesUploadProps) {
  const total = files.length + existing.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const valid: File[] = [];
    for (const f of picked) {
      if (f.size === 0) {
        toast.error(`${f.name} is empty`);
        continue;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${f.name} is larger than ${maxSizeMB} MB`);
        continue;
      }
      valid.push(f);
    }

    const room = maxFiles - total;
    if (valid.length > room) {
      toast.error(`You can have at most ${maxFiles} files`);
    }
    if (room > 0 && valid.length > 0) onAdd(valid.slice(0, room));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* saved files */}
      {existing.map((f) => (
        <div
          key={f.id}
          className="flex items-center gap-3 p-2.5 border border-gray-200 rounded-xl bg-gray-50"
        >
          <div className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0 text-green-600">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              {f.name}
            </p>
            <p className="text-xs text-gray-400">Saved</p>
          </div>
          {f.url && (
            <a
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-white transition-colors"
            >
              <ExternalLink size={12} />
              View
            </a>
          )}
          {onRemoveExisting && (
            <button
              type="button"
              onClick={() => onRemoveExisting(f.id)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          )}
        </div>
      ))}

      {/* newly picked files */}
      {files.map((f, i) => (
        <div
          key={`${f.name}-${i}`}
          className="flex items-center gap-3 p-2.5 border border-blue-200 rounded-xl bg-blue-50/40"
        >
          <div className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center shrink-0 text-[rgb(33,76,123)]">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              {f.name}
            </p>
            <p className="text-xs text-gray-400">
              {`${(f.size / 1024).toFixed(1)} KB · will upload on save`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemoveNew(i)}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <X size={12} />
            Remove
          </button>
        </div>
      ))}

      {/* add more */}
      {total < maxFiles && (
        <label className="cursor-pointer group">
          <input
            type="file"
            multiple
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
          <div
            className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors group-hover:border-[rgb(33,76,123)] group-hover:bg-blue-50/30 ${total === 0 ? "h-28" : "h-16"}`}
          >
            <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-[rgb(33,76,123)] transition-colors">
              <FileUp size={total === 0 ? 26 : 20} />
              <p className="text-sm font-medium">
                {total === 0 ? label : "Add more files"}
              </p>
              {total === 0 && <p className="text-xs">{hint}</p>}
            </div>
          </div>
        </label>
      )}
      <p className="text-xs text-gray-400">
        {total} / {maxFiles} files
      </p>
    </div>
  );
}
