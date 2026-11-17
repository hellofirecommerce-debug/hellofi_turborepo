import { IndianRupee, ShieldCheck, Smartphone } from "lucide-react";
import type { OrderAnswer } from "../types";

interface Props {
  price: number;
  answers: OrderAnswer[];
  productName: string;
  productImage?: string | null;
}

const CDN = process.env.NEXT_PUBLIC_CDN_URL ?? "";

const imageUrl = (path?: string | null) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${CDN}/${path}`;
};

export default function EstimatedValueCard({
  price,
  answers,
  productName,
  productImage,
}: Props) {
  const src = imageUrl(productImage);

  return (
    <aside className="rounded-xl border border-blue-100 bg-white p-5 lg:sticky lg:top-24">
      {/* product image */}
      <div className="mb-5 flex h-36 items-center justify-center rounded-lg bg-[#F8FAFF]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={productName}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <Smartphone size={40} className="text-[#38BDF8]/60" />
        )}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-gray-500">
            DEVICE EVALUATION
          </p>
          <p className="mt-1 text-sm font-bold text-gray-900">
            Estimated Value
          </p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0066FF] text-white">
          <IndianRupee size={14} />
        </span>
      </div>

      <p className="mt-4 text-3xl font-extrabold text-[#0066FF]">
        ₹ {price.toLocaleString("en-IN")}
      </p>

      <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#EEF3FF] px-3 py-2 text-[11px] font-medium text-[#0066FF]">
        <ShieldCheck size={13} />
        Price Subject to Physical Verification
      </p>

      {/* desktop only, like the design */}
      {answers.length > 0 && (
        <div className="mt-5 hidden lg:block">
          <p className="border-b border-blue-100 pb-2 text-[11px] font-bold tracking-wider text-gray-900">
            YOUR ANSWERS
          </p>

          <ul className="mt-2 flex flex-col">
            {answers.map((a) => (
              <li
                key={a.conditionId}
                className="flex items-start justify-between gap-4 py-1.5 text-xs"
              >
                <span className="font-semibold text-gray-700">
                  {a.question}
                </span>
                <span className="flex items-center gap-1.5 text-right font-bold text-[#0066FF]">
                  {a.answer}
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0066FF]" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
