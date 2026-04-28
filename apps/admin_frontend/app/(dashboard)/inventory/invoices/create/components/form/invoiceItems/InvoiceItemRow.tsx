"use client";
import { Label, Button, Input, SearchableInput } from "@repo/ui";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { InvoiceItemType, InventoryProductForInvoice } from "../../../types";

type ImeiStatus = {
  loading: boolean;
  eligible?: boolean;
  reason?: string;
  product?: Pick<InventoryProductForInvoice, "productName" | "storage" | "ram">;
};

interface Props {
  item: InvoiceItemType;
  index: number;
  showRemove: boolean;
  status: ImeiStatus | undefined;
  isInsideBangalore: boolean;
  inputValue: (field: string) => string;
  onRemove: () => void;
  onUpdate: (key: string, value: string | number) => void;
  onNumberChange: (field: string, value: string) => void;
  onImeiChange: (value: string) => void;
  onImeiSearch: (query: string) => Promise<string[]>;
  onImeiSelect: (label: string) => void;
}

export function InvoiceItemRow({
  item,
  index,
  showRemove,
  status,
  isInsideBangalore,
  inputValue,
  onRemove,
  onUpdate,
  onNumberChange,
  onImeiChange,
  onImeiSelect,
  onImeiSearch,
}: Props) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">
          Item {index + 1}
        </span>
        {showRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 size-7"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* IMEI */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label>Serial Number / IMEI</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchableInput
                value={item.serialNumber ?? ""}
                placeholder="Type 2+ chars to search IMEI or serial..."
                debounceMs={400}
                onChange={(val) => {
                  onImeiChange(val);
                  onImeiSelect(val);
                }}
                onSearch={onImeiSearch}
              />
            </div>
            {status?.loading && (
              <div className="w-4 h-4 border-2 border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin shrink-0" />
            )}
            {!status?.loading && status?.eligible === true && (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            )}
            {!status?.loading && status?.eligible === false && (
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
          </div>
          {status?.eligible === true && status.product && (
            <div className="flex items-center gap-2 mt-1 p-2 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <p className="text-xs text-green-700">
                <span className="font-medium">
                  {[
                    status.product.productName,
                    status.product.storage,
                    status.product.ram,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                {" · "}linked to inventory
              </p>
            </div>
          )}
          {status?.eligible === false && status.reason && (
            <p className="text-xs text-red-500 mt-1">{status.reason}</p>
          )}
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label>Product Name</Label>
          <Input
            placeholder="Apple iPhone 13 Pro Max 256GB"
            value={item.product}
            onChange={(e) => onUpdate("product", e.target.value)}
          />
          {item.inventoryProductId && (
            <p className="text-xs text-green-600">Auto-filled from inventory</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label>HSN/SAC</Label>
          <Input
            placeholder="84713000"
            value={item.hsnSac ?? ""}
            onChange={(e) => onUpdate("hsnSac", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Qty</Label>
          <Input
            type="number"
            min="1"
            step="1"
            placeholder="1"
            value={inputValue("qty")}
            onChange={(e) => onNumberChange("qty", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>UOM</Label>
          <Input
            placeholder="Nos"
            value={item.uom}
            onChange={(e) => onUpdate("uom", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Rate (₹)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={inputValue("rate")}
            onChange={(e) => onNumberChange("rate", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Discount (₹)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={inputValue("discount")}
            onChange={(e) => onNumberChange("discount", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>
            {isInsideBangalore ? "GST Amount (CGST+SGST)" : "GST Amount (IGST)"}
          </Label>
          <Input
            type="number"
            placeholder="0.00"
            value={inputValue("gstAmount")}
            onChange={(e) => onNumberChange("gstAmount", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Total (₹)</Label>
          <Input
            value={item.total.toFixed(2)}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Gross After Discount (₹)</Label>
          <Input
            value={item.gross.toFixed(2)}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      {item.gstAmount > 0 && (
        <div className="mt-1 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-1">
            GST Breakdown
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {isInsideBangalore ? (
              <>
                <span className="text-gray-500">
                  CGST (9%):{" "}
                  <span className="font-medium text-gray-800">
                    ₹{(item.gstAmount / 2).toFixed(2)}
                  </span>
                </span>
                <span className="text-gray-500">
                  SGST (9%):{" "}
                  <span className="font-medium text-gray-800">
                    ₹{(item.gstAmount / 2).toFixed(2)}
                  </span>
                </span>
              </>
            ) : (
              <span className="text-gray-500">
                IGST (18%):{" "}
                <span className="font-medium text-gray-800">
                  ₹{item.gstAmount.toFixed(2)}
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
