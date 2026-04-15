import React from "react";
import { Skeleton } from "@repo/ui";

export const InventorySkeleton: React.FC = () => (
  <div className="p-4 flex flex-col gap-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);
