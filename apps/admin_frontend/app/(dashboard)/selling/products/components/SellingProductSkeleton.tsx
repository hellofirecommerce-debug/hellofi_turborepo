import React from "react";
import { Skeleton } from "@repo/ui";

export const SellingProductSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-4 py-4 border-b border-gray-100"
      >
        <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-8 w-10 rounded-lg ml-auto" />
        <Skeleton className="h-8 w-10 rounded-lg" />
        <Skeleton className="h-8 w-10 rounded-lg" />
      </div>
    ))}
  </>
);
