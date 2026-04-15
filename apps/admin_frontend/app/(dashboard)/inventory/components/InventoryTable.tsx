"use client";
import React, { useState } from "react";
import { Table } from "../../../../components/table/Table";
import { TableHeader } from "../../../../components/table/TableHeader";
import { TableBody } from "../../../../components/table/TableBody";
import { TableRow } from "../../../../components/table/TableRow";
import { TableCell } from "../../../../components/table/TableCell";
import { Pagination } from "../../../../components/table/Pagination";
import { InventoryProduct } from "../types";
import { SortableHeader, SortConfig } from "./InventorySortableHeader";
import { InventoryDetailsModal } from "./InventoryDetailsModal";
import { InventoryTableRow } from "./InventoryTableRow";

interface InventoryTableProps {
  data: InventoryProduct[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsSold: (product: InventoryProduct) => void;
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  total,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onMarkAsSold,
  sortConfig,
  onSort,
}) => {
  const [viewProduct, setViewProduct] = useState<InventoryProduct | null>(null);

  return (
    <div>
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1400px] min-h-[400px]">
          <Table>
            <TableHeader>
              <TableCell isHeader className="min-w-[160px]">
                Order ID
              </TableCell>
              <TableCell isHeader className="min-w-[300px]">
                Product
              </TableCell>
              <TableCell isHeader className="min-w-[160px]">
                IMEI / Serial
              </TableCell>
              <TableCell isHeader className="min-w-[100px]">
                Brand
              </TableCell>
              <TableCell isHeader className="min-w-[140px]">
                Category
              </TableCell>
              <TableCell isHeader className="min-w-[130px]">
                <SortableHeader
                  field="costPrice"
                  label="Cost Price"
                  sortConfig={sortConfig}
                  onSort={onSort}
                />
              </TableCell>
              <TableCell isHeader className="min-w-[130px]">
                Selling Price
              </TableCell>
              <TableCell isHeader className="min-w-[160px]">
                <SortableHeader
                  field="purchaseDate"
                  label="Purchase Date"
                  sortConfig={sortConfig}
                  onSort={onSort}
                />
              </TableCell>
              <TableCell isHeader className="min-w-[130px]">
                <SortableHeader
                  field="sellingDate"
                  label="Selling Date"
                  sortConfig={sortConfig}
                  onSort={onSort}
                />
              </TableCell>
              <TableCell isHeader className="min-w-[150px]">
                Customer
              </TableCell>
              <TableCell isHeader className="min-w-[80px]">
                <SortableHeader
                  field="tat"
                  label="TAT"
                  sortConfig={sortConfig}
                  onSort={onSort}
                />
              </TableCell>
              <TableCell isHeader className="min-w-[130px]">
                <SortableHeader
                  field="grossProfit"
                  label="Gross Profit"
                  sortConfig={sortConfig}
                  onSort={onSort}
                />
              </TableCell>
              <TableCell isHeader className="min-w-[100px]">
                Status
              </TableCell>
              <TableCell isHeader className="min-w-[130px]">
                Action
              </TableCell>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={14}
                    className="text-center py-12 text-gray-400"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((product) => (
                  <InventoryTableRow
                    key={product.id}
                    product={product}
                    onView={setViewProduct}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMarkAsSold={onMarkAsSold}
                  />
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

      <InventoryDetailsModal
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />
    </div>
  );
};
