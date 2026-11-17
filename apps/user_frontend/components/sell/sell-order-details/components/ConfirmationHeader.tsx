import { Check } from "lucide-react";
import type { ConfirmedOrder } from "../types";
import { longDate, scheduleOf } from "../format";

export function ConfirmationHeader({ order }: { order: ConfirmedOrder }) {
  const { date, slot } = scheduleOf(order);
  const drop = order.isDropToOffice;

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-10 text-center sm:py-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-lg shadow-blue-500/30">
        <Check size={26} strokeWidth={3} />
      </span>

      <h1 className="mt-5 text-2xl font-extrabold text-gray-900 sm:text-3xl">
        {drop ? "Drop-off Scheduled!" : "Pickup Scheduled!"}
      </h1>

      {date && slot && (
        <p className="mt-2 text-sm text-[#0066FF]">
          {drop
            ? "Please bring your device to our store on"
            : "Your device will be picked up on"}{" "}
          {longDate(date)} · {slot}
        </p>
      )}

      <span className="mt-4 inline-block max-w-full break-all rounded-md border border-[#0066FF] bg-white px-4 py-1.5 text-xs font-semibold text-gray-800">
        Order #{order.orderNo}
      </span>
    </header>
  );
}
