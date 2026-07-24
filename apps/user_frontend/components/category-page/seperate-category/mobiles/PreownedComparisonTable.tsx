import { CheckCircle2 } from "lucide-react";

interface ComparisonRow {
  feature: string;
  hellofi: string;
  refurbished: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Original Parts",
    hellofi: "100% Genuine",
    refurbished: "May vary (3rd party parts common)",
  },
  {
    feature: "Repair History",
    hellofi: "No Internal Repairs",
    refurbished: "Usually includes major repairs",
  },
  {
    feature: "Resale Value",
    hellofi: "High",
    refurbished: "Low",
  },
  {
    feature: "Original Accessories",
    hellofi: "Frequently",
    refurbished: "Rare",
  },
  {
    feature: "Condition Transparency",
    hellofi: "High",
    refurbished: "Depends",
  },
  {
    feature: "Warranty",
    hellofi: "Yes if available",
    refurbished: "No",
  },
];

export function PreownedComparisonTable() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black text-center mb-2">
        Preowned vs. Refurbished
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 sm:mb-8">
        Understand the HelloFi difference in parts and reliability.
      </p>

      <div className="bg-white border border-card-border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-primary-surface">
              <th className="text-left text-[10px] sm:text-xs font-bold text-black uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3">
                Feature
              </th>
              <th className="text-left text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3">
                HelloFi Preowned
              </th>
              <th className="text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3">
                Refurbished
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map(({ feature, hellofi, refurbished }, i) => (
              <tr
                key={feature}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="text-xs sm:text-sm font-medium text-black px-3 sm:px-4 py-3 sm:py-3.5">
                  {feature}
                </td>
                <td className="text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-3.5">
                  <span className="flex items-center gap-1.5 font-semibold text-success">
                    <CheckCircle2 size={14} />
                    {hellofi}
                  </span>
                </td>
                <td className="text-xs sm:text-sm text-gray-500 px-3 sm:px-4 py-3 sm:py-3.5">
                  {refurbished}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
