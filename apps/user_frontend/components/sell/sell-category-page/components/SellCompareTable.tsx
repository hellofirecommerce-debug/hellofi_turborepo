// components/sell-category-page/SellCompareTable.tsx
import Link from "next/link";
import { Reveal } from "./Reveal";

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

const toNumber = (s: string) => Number(s.replace(/[^\d]/g, ""));
const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

interface Props {
  ctaHref?: string;
}

export function SellCompareTable({ ctaHref = "#" }: Props) {
  return (
    <section className="w-full bg-white py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4">
        <Reveal>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 text-center">
            Compare Before You Sell
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-gray-500 text-center uppercase tracking-widest">
            Price comparison between HelloFi &amp; other buyback platforms
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_60px_-25px_rgba(0,102,255,0.25)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-[#0066FF]/[0.06] to-transparent">
                    <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6">
                      Mobile Model
                    </th>
                    <th className="px-4 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-[#0066FF] sm:px-6">
                      <span className="inline-flex items-center gap-1.5">
                        HelloFi Price
                        <span className="rounded-full bg-[#0066FF] px-1.5 py-0.5 text-[9px] font-bold text-white">
                          BEST
                        </span>
                      </span>
                    </th>
                    <th className="px-4 py-4 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-6">
                      Other Companies
                    </th>
                    <th className="px-4 py-4 text-right text-[11px] font-semibold uppercase tracking-wide text-emerald-600 sm:px-6">
                      You Earn More
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => {
                    const gain =
                      toNumber(row.helloFiPrice) - toNumber(row.otherPrice);
                    return (
                      <tr
                        key={row.model}
                        className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-blue-50/40"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800 sm:px-6">
                          {row.model}
                        </td>
                        <td className="whitespace-nowrap bg-[#0066FF]/[0.04] px-4 py-4 text-right font-extrabold text-[#0066FF] sm:px-6">
                          {row.helloFiPrice}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right text-gray-400 line-through decoration-red-300 sm:px-6">
                          {row.otherPrice}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right sm:px-6">
                          {gain > 0 && (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">
                              +{formatINR(gain)}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 text-center">
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#3B82F6] text-white text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
          >
            Get The Best Price for Your device Now
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
