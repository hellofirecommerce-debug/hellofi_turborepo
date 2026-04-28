"use client";
import { Button } from "@repo/ui";
import { Plus } from "lucide-react";
import { ExchangeItemRow } from "./ExchangeItemRow";

type Category = { id: string; name: string; categoryType: string };
type Brand = { id: string; name: string };
type ExchangeItemLocal = {
  id: string;
  productName: string;
  serialNumber?: string;
  brandId: string;
  categoryId: string;
  ram: string;
  storage: string;
  exchangeValue: number;
};

interface Props {
  exchangeItems: ExchangeItemLocal[];
  exchangeValue: number;
  categories: Category[];
  exchangeBrands: Record<number, Brand[]>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onCategoryChange: (index: number, categoryId: string) => void;
  onUpdate: (index: number, key: string, value: string | number) => void;
}

export function ExchangeSection({
  exchangeItems,
  exchangeValue,
  categories,
  exchangeBrands,
  onAdd,
  onRemove,
  onCategoryChange,
  onUpdate,
}: Props) {
  return (
    <div className="flex flex-col gap-3 border-t-2 border-orange-200 pt-4">
      <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
        Exchange Items
      </span>

      {exchangeItems.map((exItem, index) => (
        <ExchangeItemRow
          key={exItem.id}
          exItem={exItem}
          index={index}
          showRemove={exchangeItems.length > 1}
          categories={categories}
          brands={exchangeBrands[index] ?? []}
          onRemove={() => onRemove(index)}
          onCategoryChange={(categoryId) => onCategoryChange(index, categoryId)}
          onUpdate={(key, value) => onUpdate(index, key, value)}
        />
      ))}

      <Button
        variant="outline"
        onClick={onAdd}
        className="w-full border-dashed border-orange-300 text-orange-600 hover:text-orange-900 hover:border-orange-400 bg-orange-50"
      >
        <Plus className="w-4 h-4" />
        Add Exchange Item
      </Button>

      <div className="flex justify-between items-center p-3 bg-orange-100 border border-orange-200 rounded-lg">
        <span className="text-sm font-semibold text-orange-700">
          Total Exchange Value
        </span>
        <span className="text-sm font-bold text-orange-700">
          ₹{exchangeValue.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
