"use client";
import { InvoiceData } from "../../page";
import { Input, Label, Accordion, Button } from "@repo/ui";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export function InvoiceItemsSection({
  data,
  onChange,
  isExpanded,
  onToggle,
}: Props) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [exchangeValueInput, setExchangeValueInput] = useState("");

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

  const getExchangeValueDisplay = (): string => {
    if (exchangeValueInput !== "") return exchangeValueInput;
    if (data.exchangeValue === 0) return "";
    return data.exchangeValue.toString();
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
      if (!isNaN(num)) {
        updateItem(
          index,
          field,
          field === "qty" ? Math.floor(Math.max(0, num)) : Math.max(0, num),
        );
      }
    }
  };

  const updateItem = (index: number, key: string, value: string | number) => {
    const newItems = [...data.items];
    const prevItem = newItems[index]!;
    const updatedItem = { ...prevItem, [key]: value };

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

  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        {
          id: Date.now().toString(),
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
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  const handleSaleTypeChange = (type: "direct" | "exchange") => {
    onChange({
      ...data,
      saleType: type,
      exchangeItems:
        type === "exchange" && data.exchangeItems.length === 0
          ? [{ id: Date.now().toString(), productName: "", serialNumber: "" }]
          : data.exchangeItems,
      exchangeValue: type === "direct" ? 0 : data.exchangeValue,
      amountPaid:
        type === "direct"
          ? data.totalAmount
          : data.totalAmount - data.exchangeValue,
    });
    if (type === "direct") setExchangeValueInput("");
  };

  const updateExchangeItem = (
    index: number,
    key: "productName" | "serialNumber",
    value: string,
  ) => {
    const newExchangeItems = [...data.exchangeItems];
    newExchangeItems[index] = { ...newExchangeItems[index]!, [key]: value };
    onChange({ ...data, exchangeItems: newExchangeItems });
  };

  const addExchangeItem = () => {
    onChange({
      ...data,
      exchangeItems: [
        ...data.exchangeItems,
        { id: Date.now().toString(), productName: "", serialNumber: "" },
      ],
    });
  };

  const removeExchangeItem = (index: number) => {
    const newExchangeItems = data.exchangeItems.filter((_, i) => i !== index);
    onChange({
      ...data,
      exchangeItems:
        newExchangeItems.length > 0
          ? newExchangeItems
          : [{ id: Date.now().toString(), productName: "", serialNumber: "" }],
    });
  };

  const handleExchangeValueChange = (value: string) => {
    const valid = /^-?\d*\.?\d*$/;
    if (value !== "" && !valid.test(value)) return;
    setExchangeValueInput(value);
    if (value === "" || value === ".") {
      onChange({ ...data, exchangeValue: 0, amountPaid: data.totalAmount });
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const exchangeValue = Math.max(0, num);
      onChange({
        ...data,
        exchangeValue,
        amountPaid: Math.max(0, data.totalAmount - exchangeValue),
      });
    }
  };

  return (
    <Accordion
      title="Invoice Items"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-4">
        {/* ── Sale Type ── */}
        <div className="flex gap-2">
          <div
            onClick={() => handleSaleTypeChange("direct")}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium border-2 cursor-pointer transition-all ${
              data.saleType === "direct"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            Direct Sale
          </div>
          <div
            onClick={() => handleSaleTypeChange("exchange")}
            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium border-2 cursor-pointer transition-all ${
              data.saleType === "exchange"
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            Exchange
          </div>
        </div>

        {/* ── Products ── */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Products
          </span>

          {data.items.map((item, index) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-3 bg-white flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  Item {index + 1}
                </span>
                {data.items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 size-7"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label>Product Name</Label>
                  <Input
                    placeholder="Apple iPhone 13 Pro Max 256GB"
                    value={item.product}
                    onChange={(e) =>
                      updateItem(index, "product", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Serial Number</Label>
                  <Input
                    placeholder="SN1234567890"
                    value={item.serialNumber}
                    onChange={(e) =>
                      updateItem(index, "serialNumber", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>HSN/SAC</Label>
                  <Input
                    placeholder="84713000"
                    value={item.hsnSac}
                    onChange={(e) =>
                      updateItem(index, "hsnSac", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="1"
                    value={getInputValue(index, "qty", item.qty)}
                    onChange={(e) =>
                      handleNumberChange(index, "qty", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>UOM</Label>
                  <Input
                    placeholder="Nos"
                    value={item.uom}
                    onChange={(e) => updateItem(index, "uom", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Rate (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={getInputValue(index, "rate", item.rate)}
                    onChange={(e) =>
                      handleNumberChange(index, "rate", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Discount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={getInputValue(index, "discount", item.discount)}
                    onChange={(e) =>
                      handleNumberChange(index, "discount", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>
                    {data.billingAddress.isInsideBangalore
                      ? "GST Amount (CGST+SGST)"
                      : "GST Amount (IGST)"}
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={getInputValue(index, "gstAmount", item.gstAmount)}
                    onChange={(e) =>
                      handleNumberChange(index, "gstAmount", e.target.value)
                    }
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

              {/* GST Breakdown */}
              {item.gstAmount > 0 && (
                <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    GST Breakdown
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {data.billingAddress.isInsideBangalore ? (
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
          ))}

          {/* Add Product Button */}
          <Button
            variant="outline"
            onClick={addItem}
            className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* ── Exchange Items ── */}
        {data.saleType === "exchange" && (
          <div className="flex flex-col gap-3 border-t-2 border-orange-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                Exchange Items
              </span>
              <span className="text-xs text-gray-500">
                Serial numbers optional
              </span>
            </div>

            {data.exchangeItems.map((exItem, index) => (
              <div
                key={exItem.id}
                className="border border-orange-200 rounded-lg p-3 bg-orange-50 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-orange-700">
                    Exchange Item {index + 1}
                  </span>
                  {data.exchangeItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExchangeItem(index)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 size-7"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <Label>Product Name</Label>
                    <Input
                      placeholder="Old iPhone 11 128GB"
                      value={exItem.productName}
                      onChange={(e) =>
                        updateExchangeItem(index, "productName", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Serial Number (Optional)</Label>
                    <Input
                      placeholder="SN0000000000"
                      value={exItem.serialNumber}
                      onChange={(e) =>
                        updateExchangeItem(
                          index,
                          "serialNumber",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Exchange Item Button */}
            <Button
              variant="outline"
              onClick={addExchangeItem}
              className="w-full border-dashed border-orange-300 text-orange-600 hover:text-orange-900 hover:border-orange-400 bg-orange-50"
            >
              <Plus className="w-4 h-4" />
              Add Exchange Item
            </Button>

            {/* Exchange Value */}
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex flex-col gap-1">
              <Label>Total Exchange Value (₹)</Label>
              <Input
                type="text"
                placeholder="0.00"
                value={getExchangeValueDisplay()}
                onChange={(e) => handleExchangeValueChange(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the total value of all exchange items combined
              </p>
            </div>
          </div>
        )}

        {/* ── Summary ── */}
        <div className="bg-blue-50 rounded-lg p-3 flex flex-col gap-1.5 border border-blue-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Invoice Summary
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Gross Value</span>
            <span className="font-medium">
              ₹{data.grossValue.toLocaleString("en-IN")}
            </span>
          </div>
          {data.billingAddress.isInsideBangalore ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">CGST (9%)</span>
                <span className="font-medium">
                  ₹{data.gstCalculation.cgst.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SGST (9%)</span>
                <span className="font-medium">
                  ₹{data.gstCalculation.sgst.toLocaleString("en-IN")}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IGST (18%)</span>
              <span className="font-medium">
                ₹{data.gstCalculation.igst.toLocaleString("en-IN")}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold border-t border-blue-200 pt-1.5 mt-0.5">
            <span>Total Amount</span>
            <span className="text-green-600">
              ₹{data.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
          {data.saleType === "exchange" && (
            <>
              <div className="flex justify-between text-sm text-orange-600">
                <span>Exchange Value</span>
                <span>- ₹{data.exchangeValue.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-blue-200 pt-1.5 mt-0.5">
                <span>Amount to be Paid</span>
                <span className="text-blue-600">
                  ₹{data.amountPaid.toLocaleString("en-IN")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Accordion>
  );
}
