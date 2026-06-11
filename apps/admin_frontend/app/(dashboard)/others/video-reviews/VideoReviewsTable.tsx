"use client";
import React, { useState } from "react";
import { Pencil, Trash2, Play } from "lucide-react";
import { Button, Badge } from "@repo/ui";
import { Table } from "../../../../components/table/Table";
import { TableHeader } from "../../../../components/table/TableHeader";
import { TableBody } from "../../../../components/table/TableBody";
import { TableRow } from "../../../../components/table/TableRow";
import { TableCell } from "../../../../components/table/TableCell";
import { VideoReview } from "./types";

interface Props {
  data: VideoReview[];
  onEdit: (review: VideoReview) => void;
  onDelete: (id: string) => void;
}

export const VideoReviewsTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const CDN = process.env.NEXT_PUBLIC_CDN_URL;

  return (
    <>
      <div className="overflow-hidden">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableCell isHeader className="w-32">
                  Thumbnail
                </TableCell>
                <TableCell isHeader>Title</TableCell>
                <TableCell isHeader>Type</TableCell>
                <TableCell isHeader>Priority</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader>Created At</TableCell>
                <TableCell isHeader>Action</TableCell>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-gray-400"
                    >
                      No video reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div
                          className="relative w-[110px] h-[70px] rounded-lg border border-gray-200 overflow-hidden bg-gray-50 cursor-pointer group"
                          onClick={() =>
                            setPreviewUrl(`${CDN}/${review.videoUrl}`)
                          }
                        >
                          <img
                            src={`${CDN}/${review.thumbnailUrl}`}
                            alt={review.title ?? "Video review"}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={20} className="text-white fill-white" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">
                        {review.title ?? (
                          <span className="text-gray-400 italic">No title</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            review.type === "BUY"
                              ? "success"
                              : review.type === "SELL"
                                ? "info"
                                : "warning"
                          }
                          size="sm"
                        >
                          {review.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {review.priority}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={review.isActive ? "active" : "inactive"}
                          size="sm"
                        >
                          {review.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(review)}
                            className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(review.id)}
                            className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-10 right-0 text-white text-sm font-medium hover:text-gray-300"
            >
              ✕ Close
            </button>
            <video
              src={previewUrl}
              controls
              autoPlay
              className="w-full rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
