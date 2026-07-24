// components/category-page/shared/HowToChooseSection.tsx
import {
  FileText,
  Settings,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";

interface HowToChooseStep {
  icon: React.ElementType;
  step: string;
  title: string;
  description: string;
  tags?: string[];
}

const STEPS: HowToChooseStep[] = [
  {
    icon: FileText,
    step: "STEP 01",
    title: "Read Description Fully",
    description:
      "Examine the device condition and grading (e.g., Mint, Good, Fair). Pay close attention to the specific RAM/Storage configuration, battery health percentage, and included warranty periods.",
    tags: ["Device Grading", "Battery Health"],
  },
  {
    icon: Settings,
    step: "STEP 02",
    title: "Match Specs to Needs",
    description:
      "Check the device specifications such as processor, RAM, storage, battery capacity, display size, camera and connectivity options. Choose a product that matches your daily needs and usage requirements.",
    tags: ["Processor", "Display Tech"],
  },
  {
    icon: ShieldCheck,
    step: "STEP 03",
    title: "Verify Warranty Terms",
    description:
      "Distinguish between a Brand Warranty (original manufacturer) and a Service Warranty (platform provided). Understand what parts and labor costs are covered during the period.",
    tags: ["Brand vs Service"],
  },
  {
    icon: RotateCcw,
    step: "STEP 04",
    title: "Know Return Policy",
    description:
      "Check eligibility criteria before buying. Note the specific return window (e.g., 7 or 15 days) and the steps involved in the refund or replacement process for a hassle-free experience.",
    tags: ["Return Window"],
  },
  {
    icon: MessageSquare,
    step: "STEP 05",
    title: "Check Recent Reviews",
    description:
      "Go beyond the star rating. Read detailed HelloFi reviews and real customer experiences regarding long-term reliability and after-sales support for the specific model you're eyeing.",
    tags: ["HelloFi Verified"],
  },
  {
    icon: ShoppingBag,
    step: "STEP 06",
    title: "Review Order Summary",
    description: "",
    tags: [],
  },
];

export function HowToChooseSection() {
  return (
    <div className="w-full bg-primary-surface">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 lg:py-12">
        {/* header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <span className="text-[9px] sm:text-[10px] font-semibold text-white bg-primary px-3 py-1 rounded-full mb-3">
            Buyer's Instruction Manual
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black leading-tight">
            How to Choose the <span className="text-primary">Right</span>
            <br />
            <span className="text-primary">Product?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {STEPS.map(({ icon: Icon, step, title, description, tags }) => {
            const isLast = step === "STEP 06";
            return (
              <div
                key={step}
                className="bg-white border border-card-border rounded-xl p-4 sm:p-5 flex flex-col gap-2.5"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary-surface flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>

                <p className="text-[9px] sm:text-[10px] font-bold text-primary tracking-wide">
                  {step}
                </p>
                <p className="text-sm sm:text-base font-bold text-black">
                  {title}
                </p>

                {isLast ? (
                  <>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-gray-500">
                      Final Checks:
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-500 leading-relaxed list-disc pl-4">
                      <li>Confirm Variant, Color, and Storage</li>
                      <li>Payment: UPI, Card, or Snapmint</li>
                      <li>COD availability</li>
                    </ul>
                    <button
                      type="button"
                      className="mt-1 w-full bg-primary text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {description}
                    </p>
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] sm:text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
