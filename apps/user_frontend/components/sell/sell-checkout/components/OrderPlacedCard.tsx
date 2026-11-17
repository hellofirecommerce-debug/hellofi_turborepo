import Link from "next/link";
import { Check } from "lucide-react";

interface Props {
  orderNo: string;
  productName: string;
  price: number;
}

export default function OrderPlacedCard({
  orderNo,
  productName,
  price,
}: Props) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981] text-white shadow-lg shadow-emerald-500/30">
        <Check size={24} strokeWidth={3} />
      </span>

      <h1 className="mt-4 text-2xl font-extrabold text-gray-900">
        Your order is placed!
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        We&apos;ve received your request to sell your {productName}. Our team
        will contact you shortly.
      </p>

      <div className="mt-6 w-full rounded-xl bg-[#EEF3FF] p-4">
        <p className="text-[11px] font-semibold tracking-wider text-gray-500">
          ORDER NO
        </p>
        <p className="mt-1 break-all text-sm font-bold text-gray-900">
          {orderNo}
        </p>
        <p className="mt-3 text-2xl font-extrabold text-[#0066FF]">
          ₹ {price.toLocaleString("en-IN")}
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 rounded-xl bg-[#0066FF] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-[#0057D9]"
      >
        Go to home
      </Link>
    </div>
  );
}
