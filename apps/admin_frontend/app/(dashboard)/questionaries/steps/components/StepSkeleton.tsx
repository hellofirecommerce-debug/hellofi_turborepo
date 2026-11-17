"use client";
import React from "react";
import { Skeleton } from "@repo/ui";

export const StepSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
      >
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    ))}
  </>
);
