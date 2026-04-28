import React from "react";
import { Skeleton } from "@repo/ui";

export const SeriesSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-gray-100">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
    <div className="grid grid-cols-7 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-20" />
      ))}
    </div>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-7 gap-4 px-4 py-4 items-center border-b border-gray-100"
      >
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);
