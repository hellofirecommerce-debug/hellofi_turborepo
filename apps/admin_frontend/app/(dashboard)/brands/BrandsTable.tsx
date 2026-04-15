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
import { Brand } from "./types";

interface BrandsTableProps {
  data: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
}

export const BrandsTable: React.FC<BrandsTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-hidden">
    <div className="overflow-x-auto w-full">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableCell isHeader className="w-24">
              Logo
            </TableCell>
            <TableCell isHeader>Name</TableCell>
            <TableCell isHeader>SEO Name</TableCell>
            <TableCell isHeader>Categories</TableCell>
            <TableCell isHeader>Created At</TableCell>
            <TableCell isHeader>Action</TableCell>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-gray-400"
                >
                  No brands found
                </TableCell>
              </TableRow>
            ) : (
              data.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="w-[60px] h-[60px] rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {brand.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${brand.image}`}
                          alt={brand.name}
                          width={60}
                          height={60}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Logo</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">
                    {brand.name}
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs font-mono">
                    {brand.seoName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      {brand?.brandCategories?.length === 0 ? (
                        <span className="text-xs text-gray-400">
                          No categories
                        </span>
                      ) : (
                        brand.brandCategories.map((bc) => (
                          <div key={bc.id} className="flex items-center gap-2">
                            <Badge
                              variant={
                                bc.status === "ACTIVE" ? "info" : "default"
                              }
                              size="sm"
                            >
                              {bc.category.name}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              P:{bc.priority}
                            </span>
                            {bc.status === "INACTIVE" && (
                              <Badge variant="inactive" size="sm">
                                Off
                              </Badge>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {new Date(brand.createdAt).toLocaleDateString("en-IN", {
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
                        onClick={() => onEdit(brand)}
                        className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(brand.id)}
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
