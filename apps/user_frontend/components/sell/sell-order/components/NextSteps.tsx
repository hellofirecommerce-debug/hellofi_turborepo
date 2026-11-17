import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    title: "Schedule Pickup",
    desc: "Choose a convenient time for our agent to visit.",
  },
  {
    title: "Instant Verification",
    desc: "Quick 5-minute physical check at your doorstep.",
  },
  {
    title: "Get Paid",
    desc: "Instant bank transfer or UPI once verified.",
  },
];

interface Props {
  onAccept: () => void;
  onSaveLater: () => void;
}

export function NextSteps({ onAccept, onSaveLater }: Props) {
  return (
    <section>
      <div className="rounded-xl border border-gray-200 bg-white p-5 lg:border-0 lg:bg-transparent lg:p-0">
        <h3 className="text-sm font-bold text-gray-900">Next Steps</h3>

        <ol className="mt-4 flex flex-col gap-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[11px] font-bold text-[#0066FF]">
                {i + 1}
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">{s.title}</p>
                <p className="mt-0.5 text-[11px] text-gray-500">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={onAccept}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0066FF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[#0057D9] active:scale-[0.99]"
      >
        Accept Offer &amp; Schedule Pickup
        <ArrowRight size={16} />
      </button>

      <button
        type="button"
        onClick={onSaveLater}
        className="mt-4 block w-full text-center text-xs text-gray-500 hover:text-gray-700"
      >
        Save offer for later
      </button>
    </section>
  );
}
