interface PlatformRow {
  feature: string;
  hellofi: string;
  other: string;
}

interface PlatformComparisonContent {
  heading: string;
  rows: PlatformRow[];
}

const PLATFORM_COMPARISON: Record<string, PlatformComparisonContent> = {
  "smart-watch": {
    heading:
      "Why HelloFi is Different from Marketplaces and Other Recommerce Websites",
    rows: [
      {
        feature: "Actual device photographs",
        hellofi: "Every listing shows the actual smartwatch being sold",
        other: "Mostly catalogue or representative images",
      },
      {
        feature: "Know the exact device before purchase",
        hellofi: "Buyers can view the exact unit before ordering",
        other: "Usually model-based listings; exact unit may not be shown",
      },
      {
        feature: "Individual device inspection",
        hellofi:
          "Each smartwatch is individually tested and inspected before listing",
        other: "Standard refurbishment and quality checks",
      },
      {
        feature: "Transparent cosmetic condition",
        hellofi: "Clear disclosure of the device's cosmetic condition",
        other: "Standard grading system with limited visual details",
      },
      {
        feature: "Accessories included",
        hellofi:
          "Original accessories provided where available and clearly mentioned",
        other: "Accessories vary by product and availability",
      },
      {
        feature: "GST Invoice",
        hellofi: "GST invoice provided with every purchase",
        other: "GST invoice available",
      },
      {
        feature: "Warranty support",
        hellofi:
          "Brand Warranty/Seller Service Warranty with dedicated customer assistance",
        other: "Seller Warranty available as per product policy",
      },
      {
        feature: "Post-purchase customer support",
        hellofi: "Direct support from the HelloFi team",
        other: "Customer support available through the platform",
      },
      {
        feature: "Buying transparency",
        hellofi:
          "Customers know exactly what they're purchasing before checkout",
        other:
          "Information is generally based on the product grade and description",
      },
    ],
  },
  tablet: {
    heading:
      "Why HelloFi is Different from Marketplaces and Other Recommerce Websites",
    rows: [
      {
        feature: "Product Images",
        hellofi: "Actual photos of every tablet",
        other: "Stock images",
      },
      {
        feature: "Device Selection",
        hellofi: "Exact device you see",
        other: "Random unit from the same model",
      },
      {
        feature: "Condition Details",
        hellofi: "Detailed device-specific information",
        other: "Standard grading",
      },
      {
        feature: "Quality Check",
        hellofi: "Every device inspected before listing",
        other: "Quality checked",
      },
      {
        feature: "Warranty",
        hellofi: "Brand or 3-month HelloFi service warranty (where applicable)",
        other: "Available",
      },
      {
        feature: "Accessories Information",
        hellofi: "Clearly mentioned for every listing",
        other: "Limited",
      },
      {
        feature: "Product Transparency",
        hellofi: "Individual listing with exact description and specifications",
        other: "Standard model information",
      },
      {
        feature: "Customer Support",
        hellofi: "Direct HelloFi support",
        other: "Company support",
      },
      {
        feature: "Pricing",
        hellofi: "Competitive pricing on premium pre-owned tablets",
        other: "Standardized",
      },
      {
        feature: "Buying Experience",
        hellofi: "Know exactly what you are purchasing",
        other: "Can vary between sellers",
      },
    ],
  },
};

interface Props {
  categorySlug: string;
}

export function PlatformComparisonSection({ categorySlug }: Props) {
  const content = PLATFORM_COMPARISON[categorySlug];

  if (!content) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-5 sm:mb-6">
        {content.heading}
      </h2>

      <div className="bg-white border border-card-border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-primary-surface">
              <th className="text-left text-[10px] sm:text-xs font-bold text-black uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3">
                Feature
              </th>
              <th className="text-left text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3">
                HelloFi
              </th>
              <th className="text-left text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3">
                Other Platforms
              </th>
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, i) => (
              <tr
                key={row.feature}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="text-xs sm:text-sm font-medium text-black px-3 sm:px-4 py-3 sm:py-3.5 align-top">
                  {row.feature}
                </td>
                <td className="text-xs sm:text-sm font-semibold text-success px-3 sm:px-4 py-3 sm:py-3.5 align-top">
                  ✓ {row.hellofi}
                </td>
                <td className="text-xs sm:text-sm text-gray-500 px-3 sm:px-4 py-3 sm:py-3.5 align-top">
                  {row.other}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
