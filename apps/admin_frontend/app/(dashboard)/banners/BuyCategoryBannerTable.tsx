"use client";
import Image from "next/image";
import React from "react";
import { Button } from "@repo/ui";
import { Table } from "../../../components/table/Table";
import { TableHeader } from "../../../components/table/TableHeader";
import { TableBody } from "../../../components/table/TableBody";
import { TableRow } from "../../../components/table/TableRow";
import { TableCell } from "../../../components/table/TableCell";
import { Pencil, Trash2 } from "lucide-react";
import { BuyCategoryBanner } from "./types";

interface Props {
  banners: BuyCategoryBanner[];
  onEdit?: (banner: BuyCategoryBanner) => void;
  onDelete?: (id: string) => void;
}

export const BuyCategoryBannerTable: React.FC<Props> = ({
  banners,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Desktop</TableCell>
          <TableCell isHeader>Mobile</TableCell>
          <TableCell isHeader>Placement</TableCell>
          <TableCell isHeader>Priority</TableCell>
          <TableCell isHeader>Status</TableCell>
          <TableCell isHeader>Actions</TableCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {banners.map((banner) => (
          <TableRow key={banner.id}>
            {/* Desktop image */}
            <TableCell>
              {banner.lg ? (
                <div className="relative w-[90px] h-[45px] rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={banner.lg}
                    alt={banner.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-[90px] h-[45px] rounded-lg bg-gray-100" />
              )}
            </TableCell>

            {/* Mobile image */}
            <TableCell>
              {banner.sm ? (
                <div className="relative w-[45px] h-[60px] rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={banner.sm}
                    alt={banner.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-[45px] h-[60px] rounded-lg bg-gray-100" />
              )}
            </TableCell>

            {/* Placement */}
            <TableCell>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {banner.placement}
              </span>
            </TableCell>

            {/* Priority */}
            <TableCell>{banner.priority}</TableCell>

            {/* Status */}
            <TableCell>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  banner.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {banner.isActive ? "Active" : "Inactive"}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => onEdit?.(banner)}
                  className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  <Pencil size={15} className="text-gray-600" />
                </Button>
                <Button
                  type="button"
                  onClick={() => onDelete?.(banner.id)}
                  className="h-8 w-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={15} className="text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
