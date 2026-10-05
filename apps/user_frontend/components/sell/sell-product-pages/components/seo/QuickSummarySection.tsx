// components/sell/sell-product-pages/components/QuickSummarySection.tsx
const formatPrice = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

const DEFAULT_CITIES = [
  "Hyderabad",
  "Mumbai",
  "Kolkata",
  "Mysore",
  "Bhubaneswar",
  "Agartala",
  "Bangalore",
];

interface Props {
  productName: string;
  low: number;
  high?: number;
  cities?: string[];
}

export function QuickSummarySection({
  productName,
  low,
  high,
  cities = DEFAULT_CITIES,
}: Props) {
  const priceText =
    high !== undefined && high !== low
      ? `${formatPrice(low)}–${formatPrice(high)}`
      : formatPrice(low);

  const cityText =
    cities.length > 1
      ? `${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]}`
      : cities[0];

  return (
    <div className="rounded-2xl  bg-white p-0 ">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
        Quick Summary
      </h2>
      <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600 text-justify">
        HelloFi pays {priceText} for a used {productName}, depending on its
        storage variant, physical condition, and functionality. We provide free
        same day doorstep pickup in {cityText}. Our pickup executive arrives at
        your preferred location, inspects the device in your presence, and
        transfers the payment instantly via UPI or bank transfer. At HelloFi, we
        aim to offer one of the highest resale values compared to other buyback
        platforms. If your device&apos;s actual condition matches the details
        you submitted while getting the quote, the price is guaranteed with no
        last-minute negotiation or unnecessary deductions at the time of pickup.
      </p>
    </div>
  );
}
