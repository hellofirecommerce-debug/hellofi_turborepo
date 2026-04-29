import React from "react";
import { Skeleton } from "@repo/ui";

export const BuyingProductSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="flex items-center justify-between p-5 border-b border-gray-100">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
    <div className="p-4 border-b border-gray-100">
      <Skeleton className="h-9 w-full max-w-sm" />
    </div>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-4 py-4 border-b border-gray-100"
      >
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <div className="flex gap-2 ml-auto">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);
