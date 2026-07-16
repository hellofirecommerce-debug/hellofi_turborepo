// components/category-page/CertifiedPreownedSection.tsx
import {
  ShieldCheck,
  UserCheck,
  Award,
  CreditCard,
  CheckCircle2,
  MapPin,
  TrendingUp,
} from "lucide-react";

const FEATURE_BADGES = [
  {
    icon: ShieldCheck,
    title: "Quality Checked",
    subtitle: "Every device tested across multiple points before listing",
  },
  {
    icon: UserCheck,
    title: "Account Cleared",
    subtitle: "iCloud & Google FRP verified and removed before listing",
  },
  {
    icon: Award,
    title: "3-Month Warranty",
    subtitle: "Functional defects covered from date of purchase",
  },
  {
    icon: CreditCard,
    title: "EMI Available",
    subtitle: "Snapmint EMI, Card EMI, and UPI",
  },
];

const WHY_CHOOSE = [
  "At HelloFi we source certified preowned devices directly from individual owners, never from repair shops or bulk lots.",
  "Every device undergoes IMEI verification with iCloud Activation Lock cleared and Google FRP removed before listing for sale.",
  "Transparent condition grading: Open Box, Superb, Good, or Fair — with real product photos and a detailed description of any cosmetic marks or imperfections.",
  "Free Pan-India delivery with dispatch within 24 hours and end to end tracking from our warehouse to your doorstep.",
];

const BRAND_CATEGORIES = [
  {
    title: "SMARTPHONES",
    brands:
      "Apple iPhone, Samsung, OnePlus, Vivo, Oppo, Xiaomi, Realme, Nothing, Google Pixel, Motorola, Asus ROG, POCO, iQOO",
  },
  {
    title: "LAPTOPS",
    brands:
      "Apple MacBook, Dell, Lenovo, HP, Asus, Acer, Microsoft Surface, Samsung Galaxy Book",
  },
  {
    title: "TABLETS",
    brands: "Apple iPad, Samsung Galaxy Tab, Lenovo Tab, Xiaomi Pad",
  },
  {
    title: "SMARTWATCHES",
    brands: "Apple Watch, Samsung Galaxy Watch, Garmin, boAt, Noise",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Browse & Select",
    description:
      "Filter by category, brand, price, storage, or condition grade. Every listing shows real photos, exact specs, battery health, and an honest condition description.",
  },
  {
    title: "Place Your Order",
    description:
      "Pay securely via UPI, credit card, debit card, or net banking. Order confirmation is instant. Free delivery across India and dispatched within 24 hours.",
  },
  {
    title: "Receive & Verify",
    description:
      "Device arrives packed securely with full tracking. Inspect it against the listing. Anything off? WhatsApp us immediately and get your issue resolved in no time.",
  },
];

export function CertifiedPreownedSection() {
  return (
    <section className="relative w-full overflow-hidden pt-10 sm:pt-14 lg:pt-16 pb-24 sm:pb-28 lg:pb-32 bg-[#0B2D8F]">
      {/* decorative circle — top right */}
      <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#CBCED3]/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* hero content — block centered on page, text left-aligned inside */}
        <div className="max-w-3xl mx-auto text-left mb-8 sm:mb-10">
          {/* eyebrow */}
          <span className="inline-block text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white mb-4 sm:mb-5">
            ✓ HelloFi Certified Preowned Platform
          </span>

          {/* heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 sm:mb-4">
            Buy Certified Preowned Phones, Laptops &amp; Gadgets Online
          </h1>

          {/* description */}
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Browse certified secondhand mobile phones, laptops, MacBooks,
            tablets, and smartwatches on HelloFi. Quality checked, account
            cleared, and honestly graded. Every device is sourced directly from
            individual owners and sold exactly as received. No repairs. No
            alterations. No surprises.
            <br />
            <br />
            Shop by category. Every listing includes real photos, exact
            specifications, battery health, and a written condition description.
            Backed by a Brand warranty or 3-month HelloFi service warranty with
            No Cost EMI Options. Enjoy Fast, Free Doorstep Delivery PAN India.
          </p>
        </div>

        {/* feature badges — same centered max-w-3xl block, left-aligned cards inside */}
        <div className="max-w-3xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4 mb-8 sm:mb-10">
          {FEATURE_BADGES.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="bg-white rounded-xl border border-[#5BA3FF] p-3 sm:p-4 flex flex-col gap-1.5"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-surface flex items-center justify-center">
                <Icon size={14} className="text-primary" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-black leading-tight">
                {title}
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-500 leading-snug">
                {subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* 2x2 grid — Why Choose | Brands / Cities | How It Works — full width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* why choose — green */}
          <div className="bg-[#E6F4EA] border border-[#D1FAE5] rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold text-[#065F46] mb-3 sm:mb-4">
              Why Choose HelloFi For Preowned Mobile Phones, Laptops, Tablets
              &amp; Other Gadgets?
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              {WHY_CHOOSE.map((point) => (
                <li key={point} className="flex gap-2 items-start">
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-[#065F46] mt-0.5"
                  />
                  <span className="text-[11px] sm:text-xs text-[#065F46]/80 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* brands — purple */}
          <div className="bg-[#F3E5F5] border border-[#F3E8FF] rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-bold text-[#8A4FFE] mb-3 sm:mb-4">
              What All Brands May I Get on HelloFi?
            </h3>
            <div className="flex flex-col gap-3 sm:gap-4">
              {BRAND_CATEGORIES.map(({ title, brands }) => (
                <div key={title}>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#8A4FFE] tracking-wide mb-1">
                    {title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-black leading-relaxed">
                    {brands}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* cities — yellow */}
          <div className="bg-[#FFFDE7] border border-[#FEF9C3] rounded-2xl p-4 sm:p-5 flex gap-3 items-start">
            <MapPin size={18} className="shrink-0 text-[#854D0E] mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#713F12] mb-1.5 sm:mb-2">
                Cities Where HelloFi Service is Available for Doorstep Delivery
              </h3>
              <p className="text-[11px] sm:text-xs text-[#854D0E] leading-relaxed">
                HelloFi offers free doorstep delivery across major cities,
                regardless of the order size. Customers in major metropolitan
                cities such as Bangalore, Pune, Hyderabad, Delhi, Kolkata,
                Chennai, Mumbai, and Ahmedabad can expect delivery within 24 to
                48 hours. In every case, customers can also opt to schedule
                deliveries during a preferred time window, ensuring faster
                pickup during working hours. With HelloFi, you can shop with
                confidence knowing that your device will be delivered quickly,
                safely, and hassle-free no matter where you are in India.
              </p>
            </div>
          </div>

          {/* how it works — light blue */}
          <div className="bg-[#EAF2FF] border border-[#BFDBFE] rounded-2xl p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center">
                <TrendingUp size={18} className="text-[#1D4ED8]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1D4ED8]">
                How It Works
              </h3>
            </div>

            <div className="flex flex-col">
              {HOW_IT_WORKS.map(({ title, description }, i) => (
                <div key={title} className="flex gap-3 sm:gap-4">
                  <div className="flex flex-col items-center">
                    <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      {i + 1}
                    </div>
                    {i < HOW_IT_WORKS.length - 1 && (
                      <div className="w-px flex-1 bg-[#BFDBFE] my-1" />
                    )}
                  </div>
                  <div className="pb-5 sm:pb-6">
                    <p className="text-sm sm:text-base font-bold text-[#1D4ED8] mb-1">
                      {title}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bottom wave */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-16 sm:h-20 lg:h-24"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C240,110 480,10 720,40 C960,70 1200,20 1440,60 L1440,100 L0,100 Z"
            fill="#ecf1f7"
          />
        </svg>
      </div>
    </section>
  );
}
