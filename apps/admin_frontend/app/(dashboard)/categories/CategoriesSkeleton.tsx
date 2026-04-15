import React from "react";
import { Skeleton } from "@repo/ui";

export const CategoriesSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Top bar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Table header skeleton */}
      <div className="px-4 py-3 bg-gray-50 grid grid-cols-7 gap-4 border-b border-gray-100">
        {["w-20", "w-16", "w-24", "w-16", "w-16", "w-16", "w-16"].map(
          (w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ),
        )}
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-4 grid grid-cols-7 gap-4 items-center border-b border-gray-100"
        >
          {/* Image */}
          <Skeleton className="w-[60px] h-[60px] rounded-lg" />
          {/* Name */}
          <Skeleton className="h-4 w-24" />
          {/* SEO name */}
          <Skeleton className="h-4 w-20" />
          {/* Type */}
          <Skeleton className="h-6 w-16 rounded-full" />
          {/* Priority */}
          <Skeleton className="h-4 w-8" />
          {/* Status */}
          <Skeleton className="h-6 w-16 rounded-full" />
          {/* Actions */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};
