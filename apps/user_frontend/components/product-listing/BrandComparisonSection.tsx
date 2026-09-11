// components/product-listing/BrandComparisonSection.tsx

interface ComparisonRow {
  feature: string;
  ios: string;
  android: string;
}

const ROWS: ComparisonRow[] = [
  {
    feature: "Operating System",
    ios: "iOS (exclusive to Apple)",
    android: "Android (used by Samsung, OnePlus, Google, Xiaomi, etc.)",
  },
  {
    feature: "Ease of Use",
    ios: "Simple, consistent, and beginner-friendly interface",
    android: "More customization and flexibility",
  },
  {
    feature: "Performance",
    ios: "Optimized hardware and software provide smooth long-term performance",
    android: "Performance varies by brand and model",
  },
  {
    feature: "Software Updates",
    ios: "Typically receives updates for 5–7 years or more",
    android: "Update support varies by manufacturer",
  },
  {
    feature: "App Ecosystem",
    ios: "Apps are highly optimized for iOS devices",
    android: "Wider app variety but optimization may vary",
  },
  {
    feature: "Customization",
    ios: "Limited customization options",
    android:
      "Extensive customization of themes, widgets, launchers, and settings",
  },
  {
    feature: "Device Variety",
    ios: "Limited range of models and sizes",
    android: "Available across all price ranges and specifications",
  },
  {
    feature: "Resale Value",
    ios: "Generally retains higher resale value",
    android: "Depreciation varies by brand and model",
  },
  {
    feature: "Integration",
    ios: "Seamless integration with Apple ecosystem (Mac, iPad, Watch, AirPods)",
    android: "Better compatibility with a wide range of brands and devices",
  },
  {
    feature: "Security & Privacy",
    ios: "Strong focus on privacy and security controls",
    android: "Secure but depends on manufacturer and update frequency",
  },
  {
    feature: "Repair & Accessories",
    ios: "Repairs and accessories are often more expensive",
    android: "Generally wider availability of affordable parts and accessories",
  },
  {
    feature: "Price Range",
    ios: "Mostly premium segment",
    android: "Available from budget to ultra-premium segments",
  },
];

export function BrandComparisonSection() {
  return (
    <div className="bg-white border border-card-border rounded-xl overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <h2 className="text-sm sm:text-base font-bold text-black text-center">
          Compare Popular Secondhand SmartPhone Brands
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-xs sm:text-sm font-bold text-white px-3 sm:px-4 py-2.5 sm:py-3">
                Feature
              </th>
              <th className="text-left text-xs sm:text-sm font-bold text-white px-3 sm:px-4 py-2.5 sm:py-3">
                Apple iPhone (iOS)
              </th>
              <th className="text-left text-xs sm:text-sm font-bold text-white px-3 sm:px-4 py-2.5 sm:py-3">
                Android Phone (Android)
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.feature}
                className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="text-xs sm:text-sm font-semibold text-black px-3 sm:px-4 py-3 align-top">
                  {row.feature}
                </td>
                <td className="text-xs sm:text-sm text-gray-600 px-3 sm:px-4 py-3 align-top">
                  {row.ios}
                </td>
                <td className="text-xs sm:text-sm text-gray-600 px-3 sm:px-4 py-3 align-top">
                  {row.android}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
