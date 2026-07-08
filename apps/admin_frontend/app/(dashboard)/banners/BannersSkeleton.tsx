import React from "react";
import { Skeleton } from "@repo/ui";

export const BannersSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Table header — 6 cols: desktop img, mobile img, placement, priority, status, actions */}
      <div className="px-4 py-3 bg-gray-50 grid grid-cols-6 gap-4 border-b border-gray-100">
        {["w-24", "w-20", "w-24", "w-16", "w-16", "w-16"].map((w, i) => (
          <Skeleton key={i} className={`h-4 ${w}`} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-4 grid grid-cols-6 gap-4 items-center border-b border-gray-100"
        >
          <Skeleton className="w-[90px] h-[45px] rounded-lg" />
          <Skeleton className="w-[45px] h-[60px] rounded-lg" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}

      {/* Pagination */}
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
