"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { OfferOrder } from "../types";
import { OfferPriceCard } from "./OfferPriceCard";
import { BetterPriceCard } from "./BetterPriceCard";
import { OfferEvaluationSummary } from "./OfferEvaluationSummary";
import { NextSteps } from "./NextSteps";
import { OfferTrustStrip } from "./OfferTrustStrip";
import { LowValueCard } from "./LowValueCard";

export function OrderOfferView({ order }: { order: OfferOrder }) {
  const router = useRouter();

  const price = order.totalAmount ?? 0;
  const handleAccept = () => router.push(`/sell/checkout/${order.orderNo}`);

  const handleSaveLater = () => router.push("/");

  // Backend already rounds; 0 means the device is too low in value
  if (price <= 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 pb-10">
        <LowValueCard productName={order.productName} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-8 sm:pt-12">
      <header className="flex flex-col items-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#10B981] text-white shadow-lg shadow-emerald-500/30 sm:h-12 sm:w-12">
          <Check size={22} strokeWidth={3} />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          Congratulations! Your offer is ready.
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          We&apos;ve locked in the best price for your {order.productName}.
        </p>
      </header>

      <div className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-6">
        <OfferPriceCard price={price} />
        <BetterPriceCard
          orderNo={order.orderNo}
          productName={order.productName}
        />
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-3xl gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-10">
        <OfferEvaluationSummary order={order} />
        <NextSteps onAccept={handleAccept} onSaveLater={handleSaveLater} />
      </div>

      <OfferTrustStrip />
    </div>
  );
}
