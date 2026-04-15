"use client";
import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button, Badge } from "@repo/ui";
import { Table } from "../../../components/table/Table";
import { TableHeader } from "../../../components/table/TableHeader";
import { TableBody } from "../../../components/table/TableBody";
import { TableRow } from "../../../components/table/TableRow";
import { TableCell } from "../../../components/table/TableCell";
import { Category } from "./types";

interface CategoriesTableProps {
  data: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-hidden">
    <div className="overflow-x-auto w-full">
      <div className="min-w-[900px]">
        <Table>
          <TableHeader>
            <TableCell isHeader className="w-24">
              Image
            </TableCell>
            <TableCell isHeader>Name</TableCell>
            <TableCell isHeader>SEO Name</TableCell>
            <TableCell isHeader>Type</TableCell>
            <TableCell isHeader>Priority</TableCell>
            <TableCell isHeader>Status</TableCell>
            <TableCell isHeader>Created At</TableCell>
            <TableCell isHeader>Action</TableCell>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-gray-400"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="w-[100px] h-[100px] rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {category.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${category.image}`}
                          alt={category.name}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-xs text-gray-400 text-center px-1">
                          100×100
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs font-mono">
                    {category.seoName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        category.categoryType === "SELL"
                          ? "info"
                          : category.categoryType === "BUY"
                            ? "success"
                            : "warning"
                      }
                      size="sm"
                    >
                      {category.categoryType === "SELL"
                        ? "Sell"
                        : category.categoryType === "BUY"
                          ? "Buy"
                          : "Sell & Buy"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {category.priority}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        category.status === "ACTIVE" ? "active" : "inactive"
                      }
                      size="sm"
                    >
                      {category.status === "ACTIVE" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString("en-IN", {
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
                        onClick={() => onEdit(category)}
                        className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(category.id)}
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
  </div>
);
