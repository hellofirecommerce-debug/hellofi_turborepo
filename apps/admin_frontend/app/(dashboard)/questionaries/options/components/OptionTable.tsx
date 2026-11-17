"use client";
import React from "react";
import { Pencil, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@repo/ui";
import { Table } from "../../../../../components/table/Table";
import { TableHeader } from "../../../../../components/table/TableHeader";
import { TableBody } from "../../../../../components/table/TableBody";
import { TableRow } from "../../../../../components/table/TableRow";
import { TableCell } from "../../../../../components/table/TableCell";
import { Pagination } from "../../../../../components/table/Pagination";
import { Option } from "../types";

interface Props {
  data: Option[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const OptionTable: React.FC<Props> = ({
  data,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        No options found. Pick a condition above.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white">
            <TableCell isHeader>Label</TableCell>
            <TableCell isHeader>Condition</TableCell>
            <TableCell isHeader>Action</TableCell>
            <TableCell isHeader>Score</TableCell>
            <TableCell isHeader>Popup</TableCell>
            <TableCell isHeader>Action</TableCell>
          </TableHeader>
          <TableBody>
            {data.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium text-gray-800">
                  {o.label}
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {o.condition?.title ?? "—"}
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {o.action}
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  {o.score} {o.scoreType}
                </TableCell>
                <TableCell>
                  {/* 👇 CHANGE THIS CHECK */}
                  {o.popupConditions && o.popupConditions.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[rgb(33,76,123)] bg-blue-50 px-2 py-1 rounded">
                      <MessageSquare size={12} />
                      {o.popupConditions.length} Popups
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(o.id)}
                      className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)]"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(o.id)}
                      className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
};
