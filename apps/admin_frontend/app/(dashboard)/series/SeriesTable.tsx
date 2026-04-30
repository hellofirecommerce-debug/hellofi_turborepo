"use client";
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button, Badge } from "@repo/ui";
import { Table } from "../../../components/table/Table";
import { TableHeader } from "../../../components/table/TableHeader";
import { TableBody } from "../../../components/table/TableBody";
import { TableRow } from "../../../components/table/TableRow";
import { TableCell } from "../../../components/table/TableCell";
import { Pagination } from "../../../components/table/Pagination";
import { Series } from "./types";
import { SkeletonRow } from "../../../components/ui/SkeletonRow";

interface SeriesTableProps {
  data: Series[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (series: Series) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const SeriesTable: React.FC<SeriesTableProps> = ({
  data,
  total,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  loading,
}) => (
  <div>
    <div className="overflow-x-auto w-full">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableCell isHeader>Series Name</TableCell>
            <TableCell isHeader>Brand</TableCell>
            <TableCell isHeader>Category</TableCell>
            <TableCell isHeader>Priority</TableCell>
            <TableCell isHeader>Status</TableCell>
            <TableCell isHeader>Created At</TableCell>
            <TableCell isHeader>Action</TableCell>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-gray-400"
                >
                  No series found
                </TableCell>
              </TableRow>
            ) : (
              data.map((series) => (
                <TableRow key={series.id}>
                  <TableCell className="font-medium text-gray-800">
                    {series.seriesName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {series.brand?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {series.category?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {series.priority}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={series.status === "ACTIVE" ? "info" : "default"}
                      size="sm"
                    >
                      {series.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(series.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(series)}
                        className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(series.id)}
                        className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    <Pagination
      currentPage={currentPage}
      totalItems={total}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  </div>
);
