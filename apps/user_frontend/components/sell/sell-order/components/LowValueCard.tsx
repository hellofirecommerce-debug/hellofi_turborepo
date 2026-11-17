import Link from "next/link";
import { AlertCircle } from "lucide-react";

export function LowValueCard({ productName }: { productName: string }) {
  return (
    <div className="mx-auto mt-10 flex w-full max-w-xl flex-col items-center rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
        <AlertCircle size={24} />
      </span>

      <h1 className="mt-4 text-xl font-extrabold text-gray-900 sm:text-2xl">
        Sorry, we can&apos;t make an offer for this device
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Based on the condition you selected, your {productName} has too low a
        value for us to buy right now.
      </p>

      <Link
        href="/sell"
        className="mt-6 rounded-xl bg-[#0066FF] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-[#0057D9]"
      >
        Sell another device
      </Link>
    </div>
  );
}
