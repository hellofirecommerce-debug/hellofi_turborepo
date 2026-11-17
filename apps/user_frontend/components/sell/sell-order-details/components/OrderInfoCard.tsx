import type { ReactNode } from "react";
import { ClipboardList } from "lucide-react";
import type { ConfirmedOrder } from "../types";
import { createdAtLabel, scheduleOf, shortDate } from "../format";

const PAYMENT = {
  UPI: { chip: "UPI", text: "Instant Transfer" },
  BANK: { chip: "BANK", text: "Bank Transfer" },
  CASH: { chip: "CASH", text: "Cash" },
} as const;

function Item({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold tracking-wider text-gray-500">
        {label}
      </p>
      <div className="mt-1 text-xs font-semibold text-gray-900">{children}</div>
    </div>
  );
}

export function OrderInfoCard({ order }: { order: ConfirmedOrder }) {
  const { date, slot } = scheduleOf(order);
  const a = order.address;

  const addressLine = a
    ? [
        [a.address, a.landMark, a.cityDistrict, a.state]
          .filter(Boolean)
          .join(", "),
        a.pinCode,
      ]
        .filter(Boolean)
        .join(" – ")
    : "";

  const payment = order.paymentMethod ? PAYMENT[order.paymentMethod] : null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
        <ClipboardList size={15} className="text-gray-600" />
        Order Details
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-gray-100 pt-4">
        <Item label="ORDER CREATED">{createdAtLabel(order.createdAt)}</Item>

        <Item label="SCHEDULE">
          {date && slot ? `${shortDate(date)}, ${slot}` : "—"}
        </Item>

        <Item
          label={order.isDropToOffice ? "YOUR ADDRESS" : "PICKUP ADDRESS"}
          className="col-span-2"
        >
          {addressLine || "—"}
        </Item>

        <Item label="PAYMENT MODE">
          {payment ? (
            <span className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-700">
                {payment.chip}
              </span>
              {payment.text}
            </span>
          ) : (
            "—"
          )}
        </Item>

        <Item label={order.isDropToOffice ? "DROP-OFF MODE" : "PICKUP MODE"}>
          {order.isDropToOffice ? "Store Drop-off" : "Doorstep Pickup"}
        </Item>
      </div>
    </section>
  );
}
