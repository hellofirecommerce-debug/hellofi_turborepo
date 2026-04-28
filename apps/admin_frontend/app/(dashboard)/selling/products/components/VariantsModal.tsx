"use client";
import React from "react";
import { Modal, Badge } from "@repo/ui";
import { SellingProduct } from "../types";

interface Props {
  product: SellingProduct | null;
  onClose: () => void;
}

export const VariantsModal: React.FC<Props> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={!!product}
      onClose={onClose}
      title={`Variants — ${product.productName}`}
      description={
        product.isConstantRam
          ? `Constant RAM: ${product.ram ?? "—"}`
          : "RAM varies per variant"
      }
      size="lg"
    >
      {product.variants.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No variants found
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-3 px-3 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>RAM</span>
            <span>Storage</span>
            <span>Price</span>
            <span>Status</span>
          </div>
          {product.variants.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-4 gap-3 px-3 py-3 border border-gray-100 rounded-lg items-center"
            >
              <span className="text-sm text-gray-700">
                {product.isConstantRam ? (product.ram ?? "—") : (v.ram ?? "—")}
              </span>
              <span className="text-sm text-gray-700">{v.storage}</span>
              <span className="text-sm font-medium text-gray-800">
                ₹{v.productPrice.toLocaleString("en-IN")}
              </span>
              <Badge
                variant={v.status === "ACTIVE" ? "info" : "default"}
                size="sm"
              >
                {v.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
