import { Search, Truck, Zap } from "lucide-react";
import type { ConfirmedOrder } from "../types";
import { scheduleOf, weekdayShort } from "../format";

const PAY_TEXT = {
  UPI: "Money is transferred instantly to your UPI account before handover.",
  BANK: "Money is transferred instantly to your bank account before handover.",
  CASH: "You receive cash on the spot once your device is verified.",
} as const;

export function WhatHappensNext({ order }: { order: ConfirmedOrder }) {
  const { date, slot } = scheduleOf(order);
  const slotChip = date && slot ? `${weekdayShort(date)}, ${slot}` : null;

  const steps = [
    order.isDropToOffice
      ? {
          icon: Truck,
          title: "Visit Our Store",
          desc: "Bring your device to our store during the selected slot.",
          chip: slotChip,
        }
      : {
          icon: Truck,
          title: "Executive Arrival",
          desc: "Our executive arrives at your location during the scheduled slot.",
          chip: slotChip,
        },
    {
      icon: Search,
      title: "Quick Verification",
      desc: "A 5-minute diagnostic test is run to verify device condition.",
      chip: "~5 Mins",
    },
    {
      icon: Zap,
      title: "Instant Payment",
      desc: order.paymentMethod
        ? PAY_TEXT[order.paymentMethod]
        : "Money is transferred instantly once your device is verified.",
      chip: null,
    },
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-sm font-bold text-gray-900">What Happens Next?</h2>

      <ol className="mt-5">
        {steps.map(({ icon: Icon, title, desc, chip }, i) => (
          <li key={title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600">
                <Icon size={16} />
              </span>
              {i < steps.length - 1 && (
                <span className="my-1 w-px flex-1 bg-gray-200" />
              )}
            </div>

            <div className={i < steps.length - 1 ? "pb-6" : ""}>
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
              {chip && (
                <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                  {chip}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
