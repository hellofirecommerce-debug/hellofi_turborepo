import { BadgeCheck, ShieldCheck, Truck } from "lucide-react";

const ITEMS = [
  { icon: BadgeCheck, label: "No hidden deductions" },
  { icon: Truck, label: "Free doorstep pickup" },
  { icon: ShieldCheck, label: "Secure data wipe guaranteed" },
];

export function OfferTrustStrip() {
  return (
    <div className="mx-auto mt-10 w-full max-w-3xl border-gray-200 sm:border-t sm:pt-8">
      <ul className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-10">
        {ITEMS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[11px] font-semibold text-gray-600 sm:border-0 sm:bg-transparent sm:p-0"
          >
            <Icon size={14} className="shrink-0 text-[#0066FF]" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
