"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input, Label, Button } from "@repo/ui";
import { X, Upload } from "lucide-react";
import { VideoReview } from "./types";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  isLoading?: boolean;
  editData?: VideoReview | null;
}

const CDN = process.env.NEXT_PUBLIC_CDN_URL;

export const AddVideoReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData = null,
}) => {
  const isEdit = !!editData;
  const videoRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    type: "HOME",
    priority: "0",
    isActive: true,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title ?? "",
        type: editData.type,
        priority: String(editData.priority),
        isActive: editData.isActive,
      });
      setVideoPreview(`${CDN}/${editData.videoUrl}`);
      setThumbPreview(`${CDN}/${editData.thumbnailUrl}`);
    } else {
      setForm({ title: "", type: "HOME", priority: "0", isActive: true });
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(null);
      setThumbPreview(null);
    }
  }, [editData, isOpen]);

  const handleSubmit = () => {
    if (!isEdit && !videoFile) {
      alert("Please upload a video");
      return;
    }
    if (!isEdit && !thumbnailFile) {
      alert("Please upload a thumbnail");
      return;
    }
    onSubmit({
      ...form,
      priority: Number(form.priority),
      video: videoFile ?? undefined,
      thumbnail: thumbnailFile ?? undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Video Review" : "Add Video Review"}
          </h2>
          <button type="button" title="Close modal" onClick={onClose}>
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video-title">
              Title{" "}
              <span className="text-xs text-gray-400 font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="video-title"
              placeholder="e.g. Customer sells iPhone 15 Pro"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video-type">
              Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="video-type"
              title="Select video review type"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className={selectClass}
            >
              <option value="HOME">Home</option>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video-priority">Priority</Label>
            <Input
              id="video-priority"
              type="number"
              placeholder="0"
              value={form.priority}
              onChange={(e) =>
                setForm((p) => ({ ...p, priority: e.target.value }))
              }
            />
          </div>

          {/* Active toggle — edit only */}
          {isEdit && (
            <div className="flex items-center gap-3">
              <Label htmlFor="video-active">Active</Label>
              <input
                id="video-active"
                type="checkbox"
                title="Toggle active status"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isActive: e.target.checked }))
                }
                className="w-4 h-4 accent-[rgb(33,76,123)]"
              />
            </div>
          )}

          {/* Video Upload */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video-file">
              Video {!isEdit && <span className="text-red-500">*</span>}
              {isEdit && (
                <span className="text-xs text-gray-400 font-normal ml-1">
                  (leave empty to keep existing)
                </span>
              )}
            </Label>
            <input
              ref={videoRef}
              id="video-file"
              type="file"
              accept="video/*"
              title="Upload video file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setVideoFile(file);
                  setVideoPreview(URL.createObjectURL(file));
                }
              }}
            />
            {videoPreview ? (
              <div className="relative">
                <video
                  src={videoPreview}
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  controls
                />
                <button
                  type="button"
                  title="Remove video"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(
                      isEdit ? `${CDN}/${editData?.videoUrl}` : null,
                    );
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                title="Click to upload video"
                onClick={() => videoRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-[rgb(33,76,123)] hover:bg-blue-50 transition-colors"
              >
                <Upload size={20} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  Click to upload video
                </span>
              </button>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="thumbnail-file">
              Thumbnail {!isEdit && <span className="text-red-500">*</span>}
              {isEdit && (
                <span className="text-xs text-gray-400 font-normal ml-1">
                  (leave empty to keep existing)
                </span>
              )}
            </Label>
            <input
              ref={thumbRef}
              id="thumbnail-file"
              type="file"
              accept="image/*"
              title="Upload thumbnail image"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setThumbnailFile(file);
                  setThumbPreview(URL.createObjectURL(file));
                }
              }}
            />
            {thumbPreview ? (
              <div className="relative w-40 h-24">
                <img
                  src={thumbPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  title="Remove thumbnail"
                  onClick={() => {
                    setThumbnailFile(null);
                    setThumbPreview(
                      isEdit ? `${CDN}/${editData?.thumbnailUrl}` : null,
                    );
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                title="Click to upload thumbnail"
                onClick={() => thumbRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-[rgb(33,76,123)] hover:bg-blue-50 transition-colors"
              >
                <Upload size={20} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  Click to upload thumbnail
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="md"
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-28"
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Add Review"}
          </Button>
        </div>
      </div>
    </div>
  );
};
