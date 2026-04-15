"use client";
import { Pencil, Trash2, BadgeCheck, Eye } from "lucide-react";
import { Button, Badge } from "@repo/ui";
import { TableRow } from "../../../../components/table/TableRow";
import { TableCell } from "../../../../components/table/TableCell";
import { InventoryProduct } from "../types";

const statusVariant: Record<string, "success" | "warning" | "error"> = {
  LISTED: "success",
  NOT_LISTED: "warning",
  SOLD: "error",
};

const statusLabel: Record<string, string> = {
  LISTED: "Listed",
  NOT_LISTED: "Not Listed",
  SOLD: "Sold",
};

interface InventoryTableRowProps {
  product: InventoryProduct;
  onView: (product: InventoryProduct) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsSold: (product: InventoryProduct) => void;
}

export const InventoryTableRow: React.FC<InventoryTableRowProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
  onMarkAsSold,
}) => (
  <TableRow key={product.id}>
    <TableCell className="text-xs text-gray-600">{product.orderId}</TableCell>
    <TableCell className="font-medium text-gray-800">
      {product.productName}
      {(product?.ram || product?.storage) && (
        <span className="text-gray-500 font-normal ml-1 text-sm">
          ({[product?.ram, product?.storage].filter(Boolean).join("/")})
        </span>
      )}
    </TableCell>
    <TableCell className="font-mono text-xs text-gray-500">
      {product.imeiOrSerial}
    </TableCell>
    <TableCell className="text-gray-500">{product.brand?.name}</TableCell>
    <TableCell className="text-gray-500">{product.category?.name}</TableCell>
    <TableCell className="font-medium text-gray-800">
      ₹{Number(product.costPrice).toLocaleString("en-IN")}
    </TableCell>
    <TableCell className="font-medium text-gray-800">
      {product.sellingPrice
        ? `₹${Number(product.sellingPrice).toLocaleString("en-IN")}`
        : "—"}
    </TableCell>
    <TableCell className="text-gray-500">
      {new Date(product.purchaseDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
    </TableCell>
    <TableCell className="text-gray-500">
      {product.sellingDate
        ? new Date(product.sellingDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—"}
    </TableCell>
    <TableCell className="text-gray-500">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">
          {product.customerName}
        </span>
        <span className="text-xs text-gray-400">{product.customerPhone}</span>
      </div>
    </TableCell>
    <TableCell className="text-gray-500">
      {product.tat != null ? (
        <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded text-xs font-medium">
          {product.tat}d
        </span>
      ) : (
        "—"
      )}
    </TableCell>
    <TableCell>
      {product.grossProfit != null ? (
        <span
          className={`font-semibold text-sm ${Number(product.grossProfit) >= 0 ? "text-green-600" : "text-red-500"}`}
        >
          ₹{Number(product.grossProfit).toLocaleString("en-IN")}
        </span>
      ) : (
        "—"
      )}
    </TableCell>
    <TableCell>
      <Badge variant={statusVariant[product.status] ?? "default"} size="sm">
        {statusLabel[product.status] ?? product.status}
      </Badge>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(product)}
          className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
          title="View Details"
        >
          <Eye size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(product.id)}
          className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)] hover:bg-blue-50"
          title="Edit Purchase Details"
        >
          <Pencil size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMarkAsSold(product)}
          className={`h-8 w-8 border border-gray-200 text-gray-500 ${
            product.status !== "SOLD"
              ? "hover:border-green-400 hover:text-green-600 hover:bg-green-50"
              : "hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
          }`}
          title={
            product.status !== "SOLD" ? "Mark as Sold" : "Edit Selling Details"
          }
        >
          <BadgeCheck size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(product.id)}
          className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
          title="Delete"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);
