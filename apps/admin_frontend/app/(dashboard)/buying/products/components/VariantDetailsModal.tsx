"use client";
import React from "react";
import Image from "next/image";
import { Modal, Badge } from "@repo/ui";
import { BuyingProduct, BuyingVariant } from "../types";

interface Props {
  product: BuyingProduct | null;
  onClose: () => void;
}

const conditionColors: Record<string, string> = {
  UNBOXED: "bg-purple-100 text-purple-700",
  SUPERB: "bg-green-100 text-green-700",
  GOOD: "bg-blue-100 text-blue-700",
  FAIR: "bg-yellow-100 text-yellow-700",
  PARTIALLY_FAIR: "bg-orange-100 text-orange-700",
};

export const VariantDetailsModal: React.FC<Props> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={!!product}
      onClose={onClose}
      title={`Variants — ${product.productName}`}
      description={`${product.variants.length} variant(s)`}
      size="lg"
    >
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
        {product.variants.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No variants found
          </p>
        ) : (
          product.variants.map((variant, i) => {
            const defaultImg = variant.images.find((img) => img.isDefault);
            return (
              <div
                key={variant.id}
                className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Variant {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${conditionColors[variant.condition] ?? ""}`}
                    >
                      {variant.condition}
                    </span>
                    <Badge
                      variant={
                        variant.availability === "IN_STOCK" ? "info" : "default"
                      }
                      size="sm"
                    >
                      {variant.availability === "IN_STOCK"
                        ? "In Stock"
                        : "Out of Stock"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Default image */}
                  <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center">
                    {defaultImg?.sm ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${defaultImg.sm}`}
                        alt={defaultImg.alt ?? ""}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No img</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 text-xs">
                    <div>
                      <p className="text-gray-400">SKU</p>
                      <p className="font-medium text-gray-700">{variant.sku}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Storage</p>
                      <p className="font-medium text-gray-700">
                        {variant.storage}
                      </p>
                    </div>
                    {variant.ram && (
                      <div>
                        <p className="text-gray-400">RAM</p>
                        <p className="font-medium text-gray-700">
                          {variant.ram}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="font-medium text-gray-700">
                        ₹{variant.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">MRP</p>
                      <p className="font-medium text-gray-700">
                        ₹{variant.mrp.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Qty</p>
                      <p className="font-medium text-gray-700">
                        {variant.quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Warranty</p>
                      <p className="font-medium text-gray-700">
                        {variant.warrantyType.replace(/_/g, " ")}
                      </p>
                    </div>
                    {variant.color && (
                      <div className="flex items-center gap-1.5">
                        <p className="text-gray-400">Color</p>
                        <div className="flex items-center gap-1">
                          {variant.colorCode && (
                            <div
                              className="w-3 h-3 rounded-full border border-gray-200"
                              style={{ backgroundColor: variant.colorCode }}
                            />
                          )}
                          <p className="font-medium text-gray-700">
                            {variant.color}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Images strip */}
                {variant.images.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {variant.images.map((img) => (
                      <div
                        key={img.id}
                        className={`w-10 h-10 rounded-lg border overflow-hidden ${img.isDefault ? "border-[rgb(33,76,123)] ring-2 ring-[rgb(33,76,123)]/20" : "border-gray-200"}`}
                      >
                        {img.xs && (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${img.xs}`}
                            alt={img.alt ?? ""}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
