import React from "react";
import { Skeleton } from "@repo/ui";

export const InvoiceCreatePageSkeleton: React.FC = () => (
  <div className="flex flex-col h-full gap-4">
    {/* Page Header */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-72" />
    </div>

    {/* Settings Selector */}
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-9 w-64 rounded-md" />
      <Skeleton className="h-4 w-48" />
    </div>

    {/* TopBar */}
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
      <Skeleton className="h-10 w-44 rounded-md" />
    </div>

    {/* Layout — Form + Preview */}
    <div className="flex gap-4 flex-1">
      {/* Form side */}
      <div className="flex flex-col gap-3 w-1/2">
        {/* Company Details accordion */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>

        {/* Client Details accordion */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>

        {/* Invoice Details accordion */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>

        {/* Invoice Items accordion */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>

        {/* Additional Info accordion */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
      </div>

      {/* Preview side */}
      <div className="w-1/2 bg-white border border-gray-200 rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full min-h-[600px]" />
      </div>
    </div>
  </div>
);
