// components/category-page/seperate-category/PreownedComparisonTable.tsx
import { CheckCircle2 } from "lucide-react";

interface ComparisonRow {
  feature: string;
  colA: string;
  colB: string;
}

interface ComparisonConfig {
  title: string;
  subtitle?: string;
  featureLabel: string;
  colALabel: string;
  colBLabel: string;
  highlightColA: boolean; // true = colA gets checkmark styling (it's the "recommended" option)
  rows: ComparisonRow[];
}

const COMPARISON_CONFIG: Record<string, ComparisonConfig> = {
  "mobile-phone": {
    title: "Preowned vs. Refurbished",
    subtitle: "Understand the HelloFi difference in parts and reliability.",
    featureLabel: "Feature",
    colALabel: "HelloFi Preowned",
    colBLabel: "Refurbished",
    highlightColA: true,
    rows: [
      {
        feature: "Original Parts",
        colA: "100% Genuine",
        colB: "May vary (3rd party parts common)",
      },
      {
        feature: "Repair History",
        colA: "No Internal Repairs",
        colB: "Usually includes major repairs",
      },
      { feature: "Resale Value", colA: "High", colB: "Low" },
      {
        feature: "Original Accessories",
        colA: "Frequently",
        colB: "Rare",
      },
      {
        feature: "Condition Transparency",
        colA: "High",
        colB: "Depends",
      },
      { feature: "Warranty", colA: "Yes if available", colB: "No" },
    ],
  },
  laptop: {
    title: "Preowned vs. New",
    subtitle: "See why a preowned laptop often makes more sense.",
    featureLabel: "Factor",
    colALabel: "Preowned",
    colBLabel: "New",
    highlightColA: true,
    rows: [
      { feature: "Price", colA: "30-50% cheaper", colB: "Full price" },
      { feature: "Specs for budget", colA: "Higher", colB: "Lower" },
      {
        feature: "Depreciation hit",
        colA: "Already absorbed",
        colB: "You take it",
      },
      {
        feature: "Warranty",
        colA: "Seller or Brand warranty",
        colB: "Manufacturer standard",
      },
      {
        feature: "Premium brand access",
        colA: "Easier (Apple MacBooks, Dell, HP, Lenovo, Asus, MSI)",
        colB: "Often out of budget",
      },
    ],
  },
  tablet: {
    title:
      "Why Buying a Secondhand Tablet Makes More Sense Than Buying a Budget New Tablet",
    featureLabel: "Feature",
    colALabel: "HelloFi Secondhand Tablet",
    colBLabel: "Budget New Tablet",
    highlightColA: true,
    rows: [
      {
        feature: "Overall Performance",
        colA: "Premium processor delivers smooth performance for years",
        colB: "Entry-level processor may slow down with regular use",
      },
      {
        feature: "Display Quality",
        colA: "High-resolution displays with better brightness and colour accuracy",
        colB: "Basic LCD display with lower brightness and colour quality",
      },
      {
        feature: "Build Quality",
        colA: "Premium metal or glass construction from flagship models",
        colB: "Mostly plastic body with basic finish",
      },
      {
        feature: "Value for Money",
        colA: "Get a premium tablet at a significantly lower price",
        colB: "Pay full price for entry-level specifications",
      },
      {
        feature: "RAM & Storage",
        colA: "Higher RAM and storage options at the same budget",
        colB: "Limited RAM and storage in most budget models",
      },
      {
        feature: "Multitasking",
        colA: "Handles productivity, entertainment, and creative work with ease",
        colB: "Suitable mainly for basic browsing and media consumption",
      },
      {
        feature: "Camera Quality",
        colA: "Better front and rear cameras from premium devices",
        colB: "Average camera performance",
      },
      {
        feature: "Software Experience",
        colA: "Premium UI with smoother overall experience",
        colB: "May receive fewer software updates over time",
      },
      {
        feature: "Productivity",
        colA: "Better support for stylus, keyboards, and professional apps",
        colB: "Limited productivity features",
      },
      {
        feature: "Warranty",
        colA: "Seller warranty or remaining brand warranty on eligible devices",
        colB: "Standard manufacturer warranty",
      },
      {
        feature: "Price Advantage",
        colA: "Save substantially while getting flagship-level features",
        colB: "Spend the same amount for basic hardware",
      },
      {
        feature: "Best For",
        colA: "Students, professionals, creators, and everyday users",
        colB: "Basic users with light usage needs",
      },
    ],
  },
  "smart-watch": {
    title:
      "Preowned Apple Watch or Preowned Samsung Galaxy Watch — Which One Should You Choose?",
    featureLabel: "Comparison Factor",
    colALabel: "Preowned Apple Watch",
    colBLabel: "Preowned Samsung Galaxy Watch",
    highlightColA: false,
    rows: [
      {
        feature: "Best For",
        colA: "iPhone users",
        colB: "Android users, especially Samsung Galaxy users",
      },
      {
        feature: "Smartphone Compatibility",
        colA: "Works best with iPhone",
        colB: "Works best with Android smartphones",
      },
      {
        feature: "Operating System",
        colA: "watchOS",
        colB: "Wear OS by Google with Samsung One UI Watch",
      },
      {
        feature: "Ecosystem Integration",
        colA: "Deep integration with Apple ecosystem",
        colB: "Deep integration with Google and Samsung ecosystem",
      },
      {
        feature: "Health Monitoring",
        colA: "ECG, Heart Rate, Blood Oxygen (supported models), Sleep Tracking, Fall Detection",
        colB: "ECG (supported regions), Heart Rate, Blood Oxygen, Sleep Tracking, Body Composition (supported models)",
      },
      {
        feature: "Fitness Features",
        colA: "Apple Fitness integration, Workout Tracking, Activity Rings",
        colB: "Google Fit, Samsung Health, Advanced Workout Tracking",
      },
      {
        feature: "Navigation",
        colA: "Apple Maps integration",
        colB: "Google Maps directly on the watch",
      },
      {
        feature: "Voice Assistant",
        colA: "Siri",
        colB: "Google Assistant and Gemini-compatible features (supported models)",
      },
      {
        feature: "Contactless Payments",
        colA: "Apple Pay (where supported)",
        colB: "Google Wallet and Samsung Wallet (where supported)",
      },
      {
        feature: "App Experience",
        colA: "Optimised for Apple's App Store ecosystem",
        colB: "Access to Google Play apps and Wear OS ecosystem",
      },
      {
        feature: "Software Updates",
        colA: "Excellent long-term software support",
        colB: "Regular Wear OS and Samsung software updates",
      },
      {
        feature: "Customisation",
        colA: "Limited but polished watch faces",
        colB: "Extensive watch face and widget customisation",
      },
      {
        feature: "Safety Features",
        colA: "Fall Detection, Emergency SOS, Crash Detection (supported models)",
        colB: "Emergency SOS and safety features depending on model",
      },
      {
        feature: "Performance",
        colA: "Smooth and highly optimised with iPhone",
        colB: "Smooth performance with Android and Samsung devices",
      },
      {
        feature: "Ideal Users",
        colA: "Professionals, students, business owners, healthcare workers, fitness enthusiasts using iPhone",
        colB: "Android users, Samsung users, fitness enthusiasts, professionals seeking Google ecosystem",
      },
      {
        feature: "Main Advantage",
        colA: "Best smartwatch experience for iPhone users",
        colB: "Best smartwatch experience for Android users",
      },
      {
        feature: "Recommended Choice",
        colA: "Choose if you already own an iPhone",
        colB: "Choose if you already own an Android or Samsung Galaxy smartphone",
      },
    ],
  },
};

interface Props {
  categorySlug: string;
}

export function PreownedComparisonTable({ categorySlug }: Props) {
  const config = COMPARISON_CONFIG[categorySlug];

  if (!config) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black text-center mb-2">
        {config.title}
      </h2>
      {config.subtitle && (
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 sm:mb-8">
          {config.subtitle}
        </p>
      )}

      <div className="bg-white border border-card-border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-primary-surface">
              <th className="text-left text-[10px] sm:text-xs font-bold text-black uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3">
                {config.featureLabel}
              </th>
              <th
                className={`text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3 ${
                  config.highlightColA ? "text-primary" : "text-black"
                }`}
              >
                {config.colALabel}
              </th>
              <th
                className={`text-left text-[10px] sm:text-xs font-bold uppercase tracking-wide px-3 sm:px-4 py-2.5 sm:py-3 ${
                  config.highlightColA ? "text-gray-500" : "text-black"
                }`}
              >
                {config.colBLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {config.rows.map(({ feature, colA, colB }, i) => (
              <tr
                key={feature}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="text-xs sm:text-sm font-medium text-black px-3 sm:px-4 py-3 sm:py-3.5 align-top">
                  {feature}
                </td>
                <td className="text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-3.5 align-top">
                  {config.highlightColA ? (
                    <span className="flex items-start gap-1.5 font-semibold text-success">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      {colA}
                    </span>
                  ) : (
                    <span className="text-gray-700">{colA}</span>
                  )}
                </td>
                <td className="text-xs sm:text-sm text-gray-500 px-3 sm:px-4 py-3 sm:py-3.5 align-top">
                  {colB}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
