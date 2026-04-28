"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Button, Badge } from "@repo/ui";
import { Table } from "../../../../../components/table/Table";
import { TableHeader } from "../../../../../components/table/TableHeader";
import { TableBody } from "../../../../../components/table/TableBody";
import { TableRow } from "../../../../../components/table/TableRow";
import { TableCell } from "../../../../../components/table/TableCell";
import { Pagination } from "../../../../../components/table/Pagination";
import { SellingProduct } from "../types";
import { VariantsModal } from "./VariantsModal";

interface Props {
  data: SellingProduct[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SellingProductTable: React.FC<Props> = ({
  data,
  total,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  const [viewVariants, setViewVariants] = useState<SellingProduct | null>(null);

  return (
    <div>
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableCell isHeader className="w-16">
                Image
              </TableCell>
              <TableCell isHeader>Product Name</TableCell>
              <TableCell isHeader>Brand</TableCell>
              <TableCell isHeader>Category</TableCell>
              <TableCell isHeader>Series</TableCell>
              <TableCell isHeader>Variants</TableCell>
              <TableCell isHeader>Price</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Action</TableCell>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-gray-400"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                        {product.image && product.image !== "pending" ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${product.image}`}
                            alt={product.productName}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No img</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      <div>
                        <p>{product.productName}</p>
                        <p className="text-xs text-gray-400 font-mono">
                          {product.productSeoName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {product.brand?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {product.category?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {product.series?.seriesName ?? "—"}
                    </TableCell>
                    <TableCell>
                      {product.hasVariants ? (
                        <button
                          onClick={() => setViewVariants(product)}
                          className="text-xs text-[rgb(33,76,123)] underline hover:opacity-70"
                        >
                          {product.variants.length} variants
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No variants
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {product.productPrice
                        ? `₹${product.productPrice.toLocaleString("en-IN")}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "ACTIVE" ? "info" : "default"
                        }
                        size="sm"
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product.id)}
                          className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(product.id)}
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
      <VariantsModal
        product={viewVariants}
        onClose={() => setViewVariants(null)}
      />
    </div>
  );
};
