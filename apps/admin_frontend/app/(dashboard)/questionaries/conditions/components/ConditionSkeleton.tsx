"use client";
import React from "react";
import { Skeleton } from "@repo/ui";

export const ConditionSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
      >
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    ))}
  </>
);
