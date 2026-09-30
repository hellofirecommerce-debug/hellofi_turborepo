// components/sell-category-page/SellSteps.tsx
import { Search, ClipboardList, Wallet, Truck } from "lucide-react";

interface Step {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    icon: Search,
    title: "Select Your Phone",
    description: "Search your brand and model",
  },
  {
    number: 2,
    icon: ClipboardList,
    title: "Answer Condition Questions",
    description: "Simple questions about your phone's condition",
  },
  {
    number: 3,
    icon: Wallet,
    title: "Get Your Locked Price",
    description: "Instant quote. Price guaranteed.",
  },
  {
    number: 4,
    icon: Truck,
    title: "Schedule Free Pickup",
    description: "We come to you. Get paid same day.",
  },
];

export function SellSteps() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          Sell Your Used Mobile Phone in 4 Steps
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          The entire process takes less than 2 minutes online.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0066FF] text-white text-sm font-bold shrink-0">
                    {step.number}
                  </span>
                  <Icon size={20} className="text-[#0066FF]" />
                </div>
                <h3 className="mt-3 text-sm sm:text-base font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
