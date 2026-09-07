interface StatCard {
  value: string;
  label: string;
  note?: string;
}

interface StatsContent {
  heading: string;
  intro?: string;
  cards: StatCard[];
  insightsHeading?: string;
  insights?: string[];
  quickStats?: { label: string; value: string }[];
  disclaimer?: string;
  confidenceHeading?: string;
  confidenceIntro?: string;
  confidenceItems?: string[];
}

const STATS_CONTENT: Record<string, StatsContent> = {
  "smart-watch": {
    heading: "HelloFi in Numbers",
    intro:
      "Every smartwatch sold tells a story of trust, quality and value. These numbers reflect the confidence customers have placed in HelloFi over the years. HelloFi's in-house evaluation team has inspected thousands of premium smartwatches over the last 3 years.",
    cards: [
      { value: "6+", label: "Years in Offline Retail" },
      { value: "2.5+", label: "Years Serving Customers Online" },
      {
        value: "10,000+",
        label: "Happy Customers",
        note: "Satisfied customers across India who bought Preowned Smartwatches.",
      },
      {
        value: "2,000+",
        label: "Devices Delivered",
        note: "Preowned smartwatches successfully sold.",
      },
      {
        value: "4.9★",
        label: "Customer Satisfaction",
        note: "Google Rating based on genuine customer reviews.",
      },
    ],
    insightsHeading: "Insights from HelloFi Customers",
    insights: [
      "HelloFi analysed over 2,000 smartwatch purchases between 2024 and 2026. Approximately 68% of customers purchasing a preowned smartwatch selected an Apple Watch, while 32% preferred Samsung Galaxy Watch models. Among Apple buyers, Series 9 and Ultra were the most frequently purchased models.",
      "Apple Watch remains the preferred choice for users within the Apple ecosystem.",
      "Samsung Galaxy Watch is increasingly popular among Android users seeking premium Wear OS features.",
      "Health tracking and fitness monitoring are among the most common reasons customers choose premium smartwatches.",
      "Customers consistently prefer flagship preowned smartwatches over new budget wearables because of their superior build quality, advanced sensors and longer software support.",
    ],
    quickStats: [
      { label: "Most common cosmetic grade", value: "Superb" },
      {
        label: "Most searched models",
        value: "Apple Watch Series 9, 10, 11, Ultra 1, Ultra 2",
      },
      { label: "Average selling price", value: "₹20,000" },
      { label: "Battery health distribution", value: "95%" },
      { label: "Most common colour", value: "Black" },
      { label: "Most popular size", value: "45mm" },
    ],
    disclaimer:
      "These insights are based on HelloFi's customer purchasing trends and are intended to help buyers understand common preferences. Actual preferences may vary over time.",
    confidenceHeading: "Buy with Confidence from HelloFi",
    confidenceIntro:
      "Purchasing a secondhand Apple Watch or secondhand Samsung Watch should feel just as reassuring as buying a new one. That's why HelloFi focuses on transparency, authenticity and long-term customer satisfaction. With every eligible smartwatch, you benefit from:",
    confidenceItems: [
      "Genuine preowned premium smartwatches.",
      "Transparent condition grading.",
      "Verified functionality before listing.",
      "Brand warranty or 3 Months HelloFi service warranty (where applicable).",
      "HelloFi GST Invoice with every purchase.",
      "Original Box, Cable and first-owner purchase bill where available.",
      "Dedicated customer support before and after your purchase.",
      "Secure PAN India doorstep delivery.",
      "Easy EMI options on eligible purchases.",
    ],
  },
  tablet: {
    heading: "Our Journey in Numbers",
    cards: [
      { value: "6+", label: "Years in Offline Retail" },
      { value: "2.5+", label: "Years Serving Customers Online" },
      { value: "10,000+", label: "Happy Customers" },
      { value: "2,000+", label: "Devices Sold" },
      { value: "4.9★", label: "Google Rating" },
    ],
    insightsHeading: "Insights from HelloFi Customers",
    insights: [
      "Based on analysis of over 2,000 tablets sold by HelloFi between 2023–2026: 44% of customers preferred iPad, 14% bought for students, 35% for artists, and 7% for business use.",
    ],
    quickStats: [
      { label: "Average battery health", value: "88%" },
      { label: "Most purchased tablet", value: "Apple iPad" },
      { label: "Average resale savings", value: "40%" },
      { label: "Return %", value: "2%" },
      { label: "Warranty claim (seller service warranty)", value: "0%" },
      { label: "Popular storage size", value: "128GB" },
    ],
  },
};

interface Props {
  categorySlug: string;
}

export function StatsSection({ categorySlug }: Props) {
  const content = STATS_CONTENT[categorySlug];

  if (!content) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10">
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black text-center mb-3">
          {content.heading}
        </h2>
        {content.intro && (
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed text-justify w-full mb-6 sm:mb-8">
            {content.intro}
          </p>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {content.cards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-card-border rounded-xl p-4 sm:p-5 flex flex-col items-center text-center gap-1"
            >
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {card.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-black">
                {card.label}
              </p>
              {card.note && (
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">
                  {card.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {content.insightsHeading && (content.insights || content.quickStats) && (
        <div>
          <h3 className="text-sm sm:text-base font-bold text-black mb-2">
            {content.insightsHeading}
          </h3>
          {content.insights && (
            <ul className="flex flex-col gap-1.5 mb-4">
              {content.insights.map((insight, i) => (
                <li
                  key={i}
                  className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary"
                >
                  {insight}
                </li>
              ))}
            </ul>
          )}

          {content.quickStats && (
            <div className="bg-primary-surface rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {content.quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between gap-3 text-xs sm:text-sm"
                >
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-semibold text-black text-right">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          {content.disclaimer && (
            <p className="text-[10px] sm:text-xs text-gray-400 mt-2 italic">
              {content.disclaimer}
            </p>
          )}
        </div>
      )}

      {content.confidenceHeading && content.confidenceItems && (
        <div>
          <h3 className="text-sm sm:text-base font-bold text-black mb-2">
            {content.confidenceHeading}
          </h3>
          {content.confidenceIntro && (
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-3">
              {content.confidenceIntro}
            </p>
          )}
          <ul className="flex flex-col gap-1.5">
            {content.confidenceItems.map((item, i) => (
              <li
                key={i}
                className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
