"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@repo/ui";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-100">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Rows per page:</span>
        <select
          title="pagination-select"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[rgb(33,76,123)]/20"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          Showing {start}–{end} of {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 text-gray-500"
        >
          <ChevronLeft size={16} />
        </Button>

        {visiblePages.map((page, idx) => {
          const prev = visiblePages[idx - 1];
          const showEllipsis = prev && page - prev > 1;
          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className="px-2 text-gray-400 text-sm">...</span>
              )}
              <Button
                variant={page === currentPage ? "default" : "ghost"}
                size="icon"
                onClick={() => onPageChange(page)}
                className="h-9 w-9"
              >
                {page}
              </Button>
            </React.Fragment>
          );
        })}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 text-gray-500"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};
