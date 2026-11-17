"use client";
import React from "react";
import { Skeleton } from "@repo/ui";

export const OptionSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-5 py-4 border-b border-gray-100"
      >
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
      </div>
    ))}
  </>
);
