"use client";
import { Label, Button, Input } from "@repo/ui";
import { Trash2 } from "lucide-react";
import { InvoiceExchangeItemType } from "../../../types";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

type ExchangeItemLocal = InvoiceExchangeItemType & {
  brandId: string;
  categoryId: string;
  ram: string;
  storage: string;
  exchangeValue: number;
};

type Category = { id: string; name: string; categoryType: string };
type Brand = { id: string; name: string };

interface Props {
  exItem: ExchangeItemLocal;
  index: number;
  showRemove: boolean;
  categories: Category[];
  brands: Brand[];
  onRemove: () => void;
  onCategoryChange: (categoryId: string) => void;
  onUpdate: (key: string, value: string | number) => void;
}

export function ExchangeItemRow({
  exItem,
  index,
  showRemove,
  categories,
  brands,
  onRemove,
  onCategoryChange,
  onUpdate,
}: Props) {
  // Add these right before the return statement in InvoiceItemsSection

  return (
    <div className="border border-orange-200 rounded-lg p-3 bg-orange-50 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-orange-700">
          Exchange Item {index + 1}
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
        <div className="flex flex-col gap-1">
          <Label>
            Category <span className="text-red-500">*</span>
          </Label>
          <select
            title="category"
            value={exItem.categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={selectClass}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <Label>
            Brand <span className="text-red-500">*</span>
          </Label>
          <select
            title="brand"
            value={exItem.brandId}
            onChange={(e) => onUpdate("brandId", e.target.value)}
            disabled={!exItem.categoryId}
            className={`${selectClass} ${!exItem.categoryId ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <option value="">
              {!exItem.categoryId ? "Select category first" : "Select brand"}
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label>
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="e.g. iPhone 13 Pro Max"
            value={exItem.productName}
            onChange={(e) => onUpdate("productName", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label>
            IMEI / Serial Number <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="IMEI or serial number"
            value={exItem.serialNumber ?? ""}
            onChange={(e) => onUpdate("serialNumber", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>
            RAM{" "}
            <span className="text-xs text-gray-400 font-normal">
              (optional)
            </span>
          </Label>
          <Input
            placeholder="e.g. 6GB"
            value={exItem.ram}
            onChange={(e) => onUpdate("ram", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>
            Storage{" "}
            <span className="text-xs text-gray-400 font-normal">
              (optional)
            </span>
          </Label>
          <Input
            placeholder="e.g. 128GB"
            value={exItem.storage}
            onChange={(e) => onUpdate("storage", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label>
            Exchange Value (₹) <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            min={0}
            placeholder="e.g. 10000"
            value={exItem.exchangeValue || ""}
            onChange={(e) =>
              onUpdate("exchangeValue", parseFloat(e.target.value) || 0)
            }
          />
        </div>
      </div>
    </div>
  );
}
