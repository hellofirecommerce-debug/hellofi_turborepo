"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Label } from "@repo/ui";
import { InventoryProduct } from "../types";

interface SoldForm {
  sellingDate: string;
  sellingPrice: string;
  sellingCustomerName: string;
  sellingCustomerEmail: string;
  sellingCustomerPhone: string;
  sellingCustomerAddress: string;
  paymentMode: string;
  receivedInBank: string;
  sellingOtherCharges: string;
  splitPaymentDetails: string;
}

const initialForm: SoldForm = {
  sellingDate: new Date().toISOString().split("T")[0] ?? "",
  sellingPrice: "",
  sellingCustomerName: "",
  sellingCustomerEmail: "",
  sellingCustomerPhone: "",
  sellingCustomerAddress: "",
  paymentMode: "CASH",
  receivedInBank: "",
  sellingOtherCharges: "0",
  splitPaymentDetails: "",
};

interface MarkAsSoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SoldForm) => void;
  isLoading?: boolean;
  product: InventoryProduct | null;
}

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

export const MarkAsSoldModal: React.FC<MarkAsSoldModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  product,
}) => {
  const [form, setForm] = useState<SoldForm>(initialForm);

  const isEdit = product?.status === "SOLD";

  // ← Pre-fill form when editing existing sold product
  useEffect(() => {
    if (product && isEdit) {
      setForm({
        sellingDate: product.sellingDate
          ? ((product.sellingDate ?? "").split("T")[0] ?? "")
          : (new Date().toISOString().split("T")[0] ?? ""),
        sellingPrice: product.sellingPrice ? String(product.sellingPrice) : "",
        sellingCustomerName: product.sellingCustomerName ?? "",
        sellingCustomerEmail: product.sellingCustomerEmail ?? "",
        sellingCustomerPhone: product.sellingCustomerPhone ?? "",
        sellingCustomerAddress: product.sellingCustomerAddress ?? "",
        paymentMode: product.paymentMode ?? "CASH",
        receivedInBank: product.receivedInBank
          ? String(product.receivedInBank)
          : "",
        sellingOtherCharges: product.sellingOtherCharges
          ? String(product.sellingOtherCharges)
          : "0",
        splitPaymentDetails: product.splitPaymentDetails ?? "",
      });
    } else if (!isEdit) {
      setForm(initialForm);
    }
  }, [product, isOpen]);

  const handleChange = (key: keyof SoldForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Selling Details" : "Mark as Sold"}
      description={`${isEdit ? "Update selling details for" : "Selling"}: ${product?.productName}${`(${product?.ram}/${product?.storage})`} · Order: ${product?.orderId}`}
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Sale" : "Confirm Sale"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Sale Details */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
            Sale Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>
                Selling Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={form.sellingDate}
                onChange={(e) => handleChange("sellingDate", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Selling Price (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="e.g. 50000"
                min={0}
                value={form.sellingPrice}
                onChange={(e) => handleChange("sellingPrice", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Payment Mode <span className="text-red-500">*</span>
              </Label>
              <select
                value={form.paymentMode}
                onChange={(e) => handleChange("paymentMode", e.target.value)}
                className={selectClass}
                title="Select payment mode"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="SPLIT_PAYMENT">Split Payment</option>
                <option value="RAZORPAY">Razorpay</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Received in Bank (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="Amount received in bank"
                min={0}
                value={form.receivedInBank}
                onChange={(e) => handleChange("receivedInBank", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Selling Other Charges (₹)</Label>
              <Input
                type="number"
                placeholder="e.g. 500"
                min={0}
                value={form.sellingOtherCharges}
                onChange={(e) =>
                  handleChange("sellingOtherCharges", e.target.value)
                }
              />
            </div>

            {form.paymentMode === "SPLIT_PAYMENT" && (
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>Split Payment Details</Label>
                <Input
                  placeholder="e.g. 20000 cash + 30000 UPI"
                  value={form.splitPaymentDetails}
                  onChange={(e) =>
                    handleChange("splitPaymentDetails", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Buyer Details */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
            Buyer Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Buyer name"
                value={form.sellingCustomerName}
                onChange={(e) =>
                  handleChange("sellingCustomerName", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. 9876543210"
                value={form.sellingCustomerPhone}
                onChange={(e) =>
                  handleChange("sellingCustomerPhone", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="buyer@email.com"
                value={form.sellingCustomerEmail}
                onChange={(e) =>
                  handleChange("sellingCustomerEmail", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label>
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Full address"
                value={form.sellingCustomerAddress}
                onChange={(e) =>
                  handleChange("sellingCustomerAddress", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Product summary */}
        {product && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Product Summary
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Cost Price</span>
              <span className="font-medium text-gray-800">
                ₹{Number(product.costPrice).toLocaleString("en-IN")}
              </span>
              <span className="text-gray-500">Purchase Other Charges</span>
              <span className="font-medium text-gray-800">
                ₹{Number(product.otherCharges).toLocaleString("en-IN")}
              </span>
              {form.sellingOtherCharges &&
                Number(form.sellingOtherCharges) > 0 && (
                  <>
                    <span className="text-gray-500">Selling Other Charges</span>
                    <span className="font-medium text-gray-800">
                      ₹
                      {Number(form.sellingOtherCharges).toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              {form.sellingPrice && (
                <>
                  <span className="text-gray-500">Est. Gross Profit</span>
                  <span
                    className={`font-semibold ${
                      Number(form.sellingPrice) -
                        Number(product.costPrice) -
                        Number(product.otherCharges) -
                        Number(form.sellingOtherCharges || 0) >=
                      0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    ₹
                    {(
                      Number(form.sellingPrice) -
                      Number(product.costPrice) -
                      Number(product.otherCharges) -
                      Number(form.sellingOtherCharges || 0)
                    ).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
