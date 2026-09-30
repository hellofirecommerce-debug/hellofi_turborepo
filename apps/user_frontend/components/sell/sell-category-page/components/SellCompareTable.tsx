// components/sell-category-page/SellCompareTable.tsx
import Link from "next/link";

interface CompareRow {
  model: string;
  helloFiPrice: string;
  otherPrice: string;
}

const COMPARE_ROWS: CompareRow[] = [
  {
    model: "Apple iPhone 16 Pro Max (256GB)",
    helloFiPrice: "₹91,000",
    otherPrice: "₹86,000",
  },
  { model: "Vivo V70 Elite", helloFiPrice: "₹35,600", otherPrice: "₹31,000" },
  {
    model: "Samsung Galaxy S25 Ultra 5G (256GB)",
    helloFiPrice: "₹70,000",
    otherPrice: "₹63,000",
  },
  {
    model: "Vivo X300 Ultra (512GB)",
    helloFiPrice: "₹65,000",
    otherPrice: "₹62,000",
  },
  {
    model: "Xiaomi 17 (256GB)",
    helloFiPrice: "₹98,500",
    otherPrice: "₹86,000",
  },
  {
    model: "Nothing Phone 4a Pro (128GB)",
    helloFiPrice: "₹28,500",
    otherPrice: "₹23,000",
  },
  { model: "iQOO 15 (256GB)", helloFiPrice: "₹41,000", otherPrice: "₹40,000" },
];

interface Props {
  ctaHref?: string;
}

export function SellCompareTable({ ctaHref = "#" }: Props) {
  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center">
          Compare Before You Sell
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center uppercase tracking-wide">
          Price comparison between HelloFi &amp; other buyback platforms
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left font-semibold text-gray-500 uppercase text-[11px] tracking-wide px-4 sm:px-6 py-3">
                    Mobile Model
                  </th>
                  <th className="text-right font-semibold text-gray-500 uppercase text-[11px] tracking-wide px-4 sm:px-6 py-3">
                    HelloFi Price
                  </th>
                  <th className="text-right font-semibold text-gray-500 uppercase text-[11px] tracking-wide px-4 sm:px-6 py-3">
                    Other Companies
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.model}
                    className={
                      i !== COMPARE_ROWS.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }
                  >
                    <td className="px-4 sm:px-6 py-3 text-gray-800 whitespace-nowrap">
                      {row.model}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                      {row.helloFiPrice}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right text-red-500 whitespace-nowrap">
                      {row.otherPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#0066FF] text-white text-sm font-semibold hover:bg-[#0052cc] transition-colors"
          >
            Get The Best Price for Your device Now
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
