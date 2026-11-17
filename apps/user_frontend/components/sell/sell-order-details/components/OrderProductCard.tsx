import { Lock, Smartphone } from "lucide-react";

interface Props {
  productName: string;
  variantName?: string | null;
  productImage?: string | null;
  totalAmount: number;
}

const CDN = process.env.NEXT_PUBLIC_CDN_URL ?? "";

const imageUrl = (path?: string | null) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${CDN}/${path}`;
};

export function OrderProductCard({
  productName,
  variantName,
  productImage,
  totalAmount,
}: Props) {
  const src = imageUrl(productImage);

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="px-5 pt-5">
        <div className="mx-auto flex h-44 w-40 items-center justify-center rounded-lg bg-[#F8FAFF]">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={productName}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <Smartphone size={44} className="text-[#38BDF8]/60" />
          )}
        </div>

        <h2 className="mt-4 text-center text-lg font-extrabold text-gray-900">
          {productName}
        </h2>
        {variantName && (
          <p className="mt-1 text-center text-xs text-gray-500">
            {variantName}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-gray-100 py-4">
          <span className="text-xs text-gray-500">Final Value</span>
          <span className="text-2xl font-extrabold text-gray-900">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 bg-gray-50 py-2.5 text-[10px] font-bold tracking-wider text-gray-600">
        <Lock size={11} />
        PRICE LOCKED FOR 7 DAYS
      </p>
    </section>
  );
}
