"use client";
import { InvoiceData } from "../../../page";
import { Accordion, Button } from "@repo/ui";
import { Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  GET_INVENTORY_PRODUCT_FOR_INVOICE,
  GET_AVAILABLE_FOR_INVOICE,
} from "../../../../../../../../lib/graphql/queries/inventory.queries";
import { GET_BRANDS_BY_CATEGORY_ID } from "../../../../../../../../lib/graphql/queries/brand.queries";
import { GET_CATEGORIES } from "../../../../../../../../lib/graphql/queries/category.queries";
import {
  GetInventoryProductForInvoiceResponse,
  InventoryProductForInvoice,
} from "../../../types";
import { InvoiceItemRow } from "./InvoiceItemRow";
import { ExchangeSection } from "./ExchangeSection";
import { InvoiceSummary } from "./InvoiceSummary";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  isExpanded: boolean;
  onToggle: () => void;
  initialExchangeBrands?: Record<number, { id: string; name: string }[]>;
}

type ImeiStatusMap = Record<
  number,
  {
    loading: boolean;
    eligible?: boolean;
    reason?: string;
    product?: Pick<
      InventoryProductForInvoice,
      "productName" | "storage" | "ram"
    >;
  }
>;

type AvailableProduct = {
  id: string;
  productName: string;
  imeiOrSerial: string;
  ram?: string;
  storage?: string;
};

type Brand = { id: string; name: string };
type Category = { id: string; name: string; categoryType: string };

export function InvoiceItemsSection({
  data,
  onChange,
  isExpanded,
  onToggle,
  initialExchangeBrands,
}: Props) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [imeiStatus, setImeiStatus] = useState<ImeiStatusMap>({});
  const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>(
    {},
  );
  const productMapRef = useRef<Record<string, AvailableProduct>>({});
  const [exchangeBrands, setExchangeBrands] = useState<Record<number, Brand[]>>(
    initialExchangeBrands ?? {},
  );

  const { data: categoriesData } = useQuery<{ getCategories: Category[] }>(
    GET_CATEGORIES,
  );
  const categories = categoriesData?.getCategories ?? [];

  const [fetchBrandsByCategory] = useLazyQuery<{
    getBrandsByCategoryId: Brand[];
  }>(GET_BRANDS_BY_CATEGORY_ID);
  const [fetchAvailable] = useLazyQuery<{
    getAvailableForInvoice: { items: AvailableProduct[] };
  }>(GET_AVAILABLE_FOR_INVOICE);
  const [fetchExact] = useLazyQuery<GetInventoryProductForInvoiceResponse>(
    GET_INVENTORY_PRODUCT_FOR_INVOICE,
  );

  // ── Sync initialExchangeBrands when it arrives from parent ──
  useEffect(() => {
    if (
      initialExchangeBrands &&
      Object.keys(initialExchangeBrands).length > 0
    ) {
      setExchangeBrands(initialExchangeBrands);
    }
  }, [initialExchangeBrands]);

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, []);

  const handleExchangeCategoryChange = async (
    index: number,
    categoryId: string,
  ) => {
    const newExchangeItems = [...data.exchangeItems];
    newExchangeItems[index] = {
      ...newExchangeItems[index]!,
      categoryId,
      brandId: "",
      ram: "",
      storage: "",
    };
    const totalExchangeValue = newExchangeItems.reduce(
      (s, i) => s + (Number((i as any).exchangeValue) || 0),
      0,
    );
    onChange({
      ...data,
      exchangeItems: newExchangeItems,
      exchangeValue: totalExchangeValue,
      amountPaid: Math.max(0, data.totalAmount - totalExchangeValue),
    });
    if (!categoryId) {
      setExchangeBrands((prev) => ({ ...prev, [index]: [] }));
      return;
    }
    const { data: result } = await fetchBrandsByCategory({
      variables: { categoryId },
    });
    setExchangeBrands((prev) => ({
      ...prev,
      [index]: result?.getBrandsByCategoryId ?? [],
    }));
  };

  const getInputKey = (index: number, field: string) => `${index}-${field}`;

  const getInputValue = (
    index: number,
    field: string,
    itemValue: number,
  ): string => {
    const key = getInputKey(index, field);
    if (inputValues[key] !== undefined) return inputValues[key]!;
    if (itemValue === 0) return "";
    return itemValue.toString();
  };

  const handleNumberChange = (index: number, field: string, value: string) => {
    const key = getInputKey(index, field);
    setInputValues((prev) => ({ ...prev, [key]: value }));
    if (value === "" || value === ".") {
      updateItem(index, field, 0);
      return;
    }
    const valid = /^-?\d*\.?\d*$/.test(value);
    if (valid && value !== "-" && value !== ".") {
      const num = parseFloat(value);
      if (!isNaN(num))
        updateItem(
          index,
          field,
          field === "qty" ? Math.floor(Math.max(0, num)) : Math.max(0, num),
        );
    }
  };

  const updateItem = (index: number, key: string, value: string | number) => {
    const newItems = [...data.items];
    const updatedItem = { ...newItems[index]!, [key]: value };
    const qty = Number(updatedItem.qty) || 0;
    const rate = Number(updatedItem.rate) || 0;
    const discount = Number(updatedItem.discount) || 0;
    const gstAmount = Number(updatedItem.gstAmount) || 0;
    updatedItem.qty = qty;
    updatedItem.rate = rate;
    updatedItem.discount = discount;
    updatedItem.gstAmount = gstAmount;
    updatedItem.total = qty * rate;
    updatedItem.gross = updatedItem.total - discount;
    newItems[index] = updatedItem;
    const grossValue = newItems.reduce((s, i) => s + (Number(i.gross) || 0), 0);
    const totalGst = newItems.reduce(
      (s, i) => s + (Number(i.gstAmount) || 0),
      0,
    );
    const inBLR = data.billingAddress.isInsideBangalore;
    const gstCalculation = {
      cgst: inBLR ? totalGst / 2 : 0,
      sgst: inBLR ? totalGst / 2 : 0,
      igst: !inBLR ? totalGst : 0,
      total: totalGst,
    };
    const totalAmount = grossValue + totalGst;
    onChange({
      ...data,
      items: newItems,
      grossValue,
      gstCalculation,
      taxAmount: totalGst,
      totalAmount,
      amountPaid: Math.max(0, totalAmount - (Number(data.exchangeValue) || 0)),
    });
  };

  const updateExchangeItem = (
    index: number,
    key: string,
    value: string | number,
  ) => {
    const newExchangeItems = [...data.exchangeItems];
    newExchangeItems[index] = { ...newExchangeItems[index]!, [key]: value };
    const totalExchangeValue = newExchangeItems.reduce(
      (s, i) => s + (Number((i as any).exchangeValue) || 0),
      0,
    );
    onChange({
      ...data,
      exchangeItems: newExchangeItems,
      exchangeValue: totalExchangeValue,
      amountPaid: Math.max(0, data.totalAmount - totalExchangeValue),
    });
  };

  const handleImeiSearch = async (
    index: number,
    query: string,
  ): Promise<string[]> => {
    if (!query || query.trim().length < 2) return [];
    try {
      const { data: result } = await fetchAvailable({
        variables: { search: query.trim(), pageSize: 10 },
      });
      const items = result?.getAvailableForInvoice?.items ?? [];
      items.forEach((item) => {
        const label = `${item.productName} · ${item.imeiOrSerial}${item.storage ? ` · ${item.storage}` : ""}${item.ram ? ` · ${item.ram}` : ""}`;
        productMapRef.current[label] = item;
      });
      return items.map(
        (item) =>
          `${item.productName} · ${item.imeiOrSerial}${item.storage ? ` · ${item.storage}` : ""}${item.ram ? ` · ${item.ram}` : ""}`,
      );
    } catch {
      return [];
    }
  };

  const handleImeiSelect = async (index: number, selectedLabel: string) => {
    const product = productMapRef.current[selectedLabel];
    if (!product) return;
    setImeiStatus((prev) => ({ ...prev, [index]: { loading: true } }));
    try {
      const { data: result } = await fetchExact({
        variables: { imeiOrSerial: product.imeiOrSerial },
      });
      const inv = result?.getInventoryProductForInvoice;
      if (inv && inv.isEligible) {
        const productLabel =
          inv.storage || inv.ram
            ? `${inv.productName} (${[inv.ram, inv.storage].filter(Boolean).join("/")})`
            : inv.productName;
        const newItems = [...data.items];
        newItems[index] = {
          ...newItems[index]!,
          inventoryProductId: inv.id,
          product: productLabel,
          serialNumber: inv.imeiOrSerial,
        };
        onChange({ ...data, items: newItems });
        setImeiStatus((prev) => ({
          ...prev,
          [index]: {
            loading: false,
            eligible: true,
            product: {
              productName: inv.productName,
              storage: inv.storage,
              ram: inv.ram,
            },
          },
        }));
      } else {
        setImeiStatus((prev) => ({
          ...prev,
          [index]: {
            loading: false,
            eligible: false,
            reason: inv?.ineligibleReason ?? "Product not eligible",
          },
        }));
      }
    } catch {
      const productLabel =
        product.storage || product.ram
          ? `${product.productName} (${[product.ram, product.storage].filter(Boolean).join("/")})`
          : product.productName;
      const newItems = [...data.items];
      newItems[index] = {
        ...newItems[index]!,
        inventoryProductId: product.id,
        product: productLabel,
        serialNumber: product.imeiOrSerial,
      };
      onChange({ ...data, items: newItems });
      setImeiStatus((prev) => ({
        ...prev,
        [index]: { loading: false, eligible: true, product },
      }));
    }
  };

  const handleImeiChange = (index: number, value: string) => {
    const newItems = [...data.items];
    newItems[index] = {
      ...newItems[index]!,
      serialNumber: value,
      inventoryProductId: undefined,
      product: value ? newItems[index]!.product : "",
    };
    onChange({ ...data, items: newItems });
    if (!value) {
      setImeiStatus((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        {
          id: Date.now().toString(),
          inventoryProductId: undefined,
          product: "",
          serialNumber: "",
          hsnSac: "",
          qty: 1,
          uom: "Nos",
          rate: 0,
          total: 0,
          discount: 0,
          gstAmount: 0,
          gross: 0,
          cgstPercent: 0,
          cgstAmount: 0,
          sgstPercent: 0,
          sgstAmount: 0,
          igstPercent: 0,
          igstAmount: 0,
          sortOrder: data.items.length,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (debounceTimers.current[index])
      clearTimeout(debounceTimers.current[index]);
    const newItems = data.items.filter((_, i) => i !== index);
    setImeiStatus((prev) => {
      const next: ImeiStatusMap = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = parseInt(k);
        if (ki < index) next[ki] = v;
        else if (ki > index) next[ki - 1] = v;
      });
      return next;
    });
    onChange({ ...data, items: newItems });
  };

  const handleSaleTypeChange = (type: "direct" | "exchange") => {
    onChange({
      ...data,
      saleType: type,
      exchangeItems:
        type === "exchange" && data.exchangeItems.length === 0
          ? [
              {
                id: Date.now().toString(),
                productName: "",
                serialNumber: "",
                brandId: "",
                categoryId: "",
                ram: "",
                storage: "",
                exchangeValue: 0,
              },
            ]
          : data.exchangeItems,
      exchangeValue: type === "direct" ? 0 : data.exchangeValue,
      amountPaid:
        type === "direct"
          ? data.totalAmount
          : data.totalAmount - data.exchangeValue,
    });
  };

  const addExchangeItem = () => {
    onChange({
      ...data,
      exchangeItems: [
        ...data.exchangeItems,
        {
          id: Date.now().toString(),
          productName: "",
          serialNumber: "",
          brandId: "",
          categoryId: "",
          ram: "",
          storage: "",
          exchangeValue: 0,
        },
      ],
    });
  };

  const removeExchangeItem = (index: number) => {
    const newExchangeItems = data.exchangeItems.filter((_, i) => i !== index);
    const totalExchangeValue = newExchangeItems.reduce(
      (s, i) => s + (Number((i as any).exchangeValue) || 0),
      0,
    );
    onChange({
      ...data,
      exchangeItems:
        newExchangeItems.length > 0
          ? newExchangeItems
          : [
              {
                id: Date.now().toString(),
                productName: "",
                serialNumber: "",
                brandId: "",
                categoryId: "",
                ram: "",
                storage: "",
                exchangeValue: 0,
              },
            ],
      exchangeValue: totalExchangeValue,
      amountPaid: Math.max(0, data.totalAmount - totalExchangeValue),
    });
  };

  return (
    <Accordion
      title="Invoice Items"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div
            onClick={() => handleSaleTypeChange("direct")}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium border-2 cursor-pointer transition-all ${data.saleType === "direct" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
          >
            Direct Sale
          </div>
          <div
            onClick={() => handleSaleTypeChange("exchange")}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium border-2 cursor-pointer transition-all ${data.saleType === "exchange" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
          >
            Exchange
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Products
          </span>
          {data.items.map((item, index) => (
            <InvoiceItemRow
              key={item.id}
              item={item}
              index={index}
              showRemove={data.items.length > 1}
              status={imeiStatus[index]}
              isInsideBangalore={data.billingAddress.isInsideBangalore}
              inputValue={(field) =>
                getInputValue(index, field, (item as any)[field])
              }
              onRemove={() => removeItem(index)}
              onUpdate={(key, value) => updateItem(index, key, value)}
              onNumberChange={(field, value) =>
                handleNumberChange(index, field, value)
              }
              onImeiChange={(value) => handleImeiChange(index, value)}
              onImeiSearch={(query) => handleImeiSearch(index, query)}
              onImeiSelect={(label) => handleImeiSelect(index, label)}
            />
          ))}
          <Button
            variant="outline"
            onClick={addItem}
            className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {data.saleType === "exchange" && (
          <ExchangeSection
            exchangeItems={data.exchangeItems as any}
            exchangeValue={data.exchangeValue}
            categories={categories}
            exchangeBrands={exchangeBrands}
            onAdd={addExchangeItem}
            onRemove={removeExchangeItem}
            onCategoryChange={handleExchangeCategoryChange}
            onUpdate={updateExchangeItem}
          />
        )}

        <InvoiceSummary
          grossValue={data.grossValue}
          gstCalculation={data.gstCalculation}
          totalAmount={data.totalAmount}
          exchangeValue={data.exchangeValue}
          amountPaid={data.amountPaid}
          saleType={data.saleType}
          isInsideBangalore={data.billingAddress.isInsideBangalore}
        />
      </div>
    </Accordion>
  );
}
