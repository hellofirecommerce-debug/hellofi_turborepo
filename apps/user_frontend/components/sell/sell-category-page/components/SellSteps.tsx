// components/sell-category-page/SellSteps.tsx
import { Search, ClipboardList, Wallet, Truck } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

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
    <section className="w-full py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal>
          <p className="inline-flex rounded-full bg-[#0066FF]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0066FF]">
            Simple process
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sell Your Used Mobile Phone in 4 Steps
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            The entire process takes less than 2 minutes online.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.12}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <RevealItem key={step.number} className="relative">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-4 select-none text-8xl font-black text-[#0066FF]/[0.06]"
                  >
                    {step.number}
                  </span>

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#3B82F6] text-white shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon size={22} />
                  </div>

                  <p className="relative mt-5 text-[11px] font-bold uppercase tracking-widest text-[#0066FF]">
                    Step {step.number}
                  </p>
                  <h3 className="relative mt-1 text-base font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="relative mt-1.5 text-sm text-gray-500">
                    {step.description}
                  </p>
                </div>

                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-6 top-12 hidden h-px w-6 border-t-2 border-dashed border-blue-200 lg:block"
                  />
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
