"use client";
import React from "react";
import Image from "next/image";
import { ModalShell } from "./ModalShell";
import { AdminSellingOrder } from "../types";
import { formatCharge, formatINR } from "../helpers";

interface Props {
  order: AdminSellingOrder | null;
  onClose: () => void;
}

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2.5 text-sm">
    <span className="font-semibold text-gray-700">{label}</span>
    <span className="text-right text-gray-900">{value || "—"}</span>
  </div>
);

export const OrderDetailsModal: React.FC<Props> = ({ order, onClose }) => {
  const a = order?.address;
  const addressLine = a
    ? [a.address, a.landMark, a.cityDistrict, a.state]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <ModalShell
      isOpen={!!order}
      onClose={onClose}
      title="Order Details"
      maxWidth="max-w-xl"
    >
      {order && (
        <div>
          {order.productImage && order.productImage !== "pending" && (
            <div className="mb-3 flex justify-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${order.productImage}`}
                alt={order.productName}
                width={160}
                height={120}
                className="h-28 w-auto object-contain"
              />
            </div>
          )}
          <p className="mb-2 text-center text-base font-semibold text-gray-900">
            {order.productName}
          </p>
          {order.variantName && (
            <p className="mb-3 text-center text-xs text-gray-500">
              {order.variantName}
            </p>
          )}

          <Row label="Order No:" value={order.orderNo} />
          <Row label="Listed Price:" value={formatINR(order.listedPrice)} />
          <Row
            label="Pickup Charges:"
            value={formatCharge(order.pickupCharges)}
          />
          <Row
            label="Processing Fee:"
            value={formatCharge(order.processingFee)}
          />
          <Row
            label="Quoted Price:"
            value={formatINR(order.quotedPrice ?? order.quotedPriceBySystem)}
          />
          <Row label="Total Amount:" value={formatINR(order.totalAmount)} />

          <h4 className="mb-1 mt-5 text-sm font-bold text-gray-900">
            User Details
          </h4>
          <Row label="Name:" value={a?.name ?? order.user?.name} />
          <Row label="Contact:" value={a?.contact ?? order.user?.phone} />
          <Row label="Pin Code:" value={a?.pinCode} />
          <Row label="City:" value={a?.cityDistrict} />
          <Row label="Address:" value={addressLine} />
        </div>
      )}
    </ModalShell>
  );
};
