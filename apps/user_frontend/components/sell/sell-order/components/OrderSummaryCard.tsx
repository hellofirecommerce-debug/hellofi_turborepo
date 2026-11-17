import Image from "next/image";

interface Order {
  orderNo: string;
  orderStatus: string;
  productName: string;
  productImage?: string | null;
  brandName?: string | null;
  variantName?: string | null;
  basePrice?: number | null;
  quotedPriceBySystem?: number | null;
  pickupCharges?: number | null;
  processingFee?: number | null;
  totalAmount?: number | null;
}

const inr = (n?: number | null) =>
  `₹${Math.round(n ?? 0).toLocaleString("en-IN")}`;

const statusLabel = (s: string) =>
  s
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function OrderSummaryCard({ order }: { order: Order }) {
  const imageSrc = order.productImage
    ? `${process.env.NEXT_PUBLIC_CDN_URL}/${order.productImage}`
    : null;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-gray-500">
            ORDER NO
          </p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            {order.orderNo}
          </p>
        </div>
        <span className="rounded-full bg-[#EEF3FF] px-3 py-1 text-xs font-bold text-[#0066FF]">
          {statusLabel(order.orderStatus)}
        </span>
      </div>

      {/* Device */}
      <div className="mt-5 flex items-center gap-4 rounded-xl border border-gray-100 p-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={order.productName}
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-900">
            {order.productName}
          </p>
          {order.variantName && (
            <p className="mt-0.5 text-xs text-gray-500">{order.variantName}</p>
          )}
          {order.brandName && (
            <p className="mt-0.5 text-xs text-gray-400">{order.brandName}</p>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="mt-5 rounded-xl bg-[#EEF3FF] p-5 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#0066FF]">
          Your Quote
        </p>
        <p className="mt-1 text-3xl font-extrabold text-[#0066FF]">
          {inr(order.totalAmount)}
        </p>
      </div>

      <dl className="mt-5 flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Base price</dt>
          <dd className="font-semibold text-gray-900">
            {inr(order.basePrice)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Quoted by system</dt>
          <dd className="font-semibold text-gray-900">
            {inr(order.quotedPriceBySystem)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Pickup charges</dt>
          <dd className="font-semibold text-gray-900">
            {inr(order.pickupCharges)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Processing fee</dt>
          <dd className="font-semibold text-gray-900">
            {inr(order.processingFee)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-[11px] text-gray-400">
        Final price is subject to physical verification of the device condition
        at pickup.
      </p>
    </div>
  );
}
