// components/category-page/CertificationProcessSection.tsx
import {
  PackageCheck,
  Microscope,
  BadgeCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";

interface ProcessStep {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
  bullets?: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    icon: PackageCheck,
    title: "Device Collection",
    description: "Sellers can either:",
    bullets: ["Drop off their device, or", "Schedule a doorstep pickup."],
  },
  {
    number: "02",
    icon: Microscope,
    title: "Professional Inspection",
    description:
      "Our in-house technicians perform a comprehensive diagnostic inspection covering:",
    bullets: [
      "Hardware",
      "Software",
      "Battery Health",
      "Display Quality",
      "Physical Condition",
    ],
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "Device Grading",
    description:
      "Device receives an honest grade based on its overall condition and functionality — A+, A, B, or C grade based on condition.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Secure Packaging & Dispatch",
    description:
      "Devices are securely packed and dispatched with applicable warranty and available accessories.",
  },
];

const CHECKLIST_ITEMS = [
  "Battery health",
  "Display quality",
  "Front & rear cameras",
  "No Unauthorized Repairs",
  "Charging port",
  "Face ID / Touch ID",
  "Wi-Fi & Bluetooth",
  "SIM tray & buttons",
  "Body & frame",
  "Software & OS",
  "Not Reported Lost or Stolen",
  "See All 40+ Check Point",
];

export function CertificationProcessSection() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
        {/* Left — Our Certification Process (always first) */}
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-5 sm:mb-6">
            Our Certification Process
          </h2>

          <div className="flex flex-col gap-5 sm:gap-6">
            {PROCESS_STEPS.map(
              ({ number, icon: Icon, title, description, bullets }) => (
                <div key={number} className="flex gap-3 sm:gap-4">
                  <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-surface flex items-center justify-center">
                    <Icon size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-primary mb-0.5">
                      {number}
                    </p>
                    <p className="text-sm sm:text-base font-bold text-black mb-1">
                      {title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {description}
                    </p>
                    {bullets && (
                      <ul className="mt-1.5 flex flex-col gap-0.5">
                        {bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-xs sm:text-sm text-gray-500 pl-3 relative before:content-['•'] before:absolute before:left-0"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Right — 40-Point Checklist (second on mobile) */}
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-5 sm:mb-6">
            40-Point Checklist
          </h2>

          {/* image placeholder with overlay badge */}
          <div className="relative aspect-video rounded-2xl bg-gray-200 flex items-center justify-center mb-4 sm:mb-5 overflow-hidden">
            <span className="text-xs sm:text-sm font-medium text-gray-400">
              Inspection Photo
            </span>
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2">
              <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success flex items-center justify-center">
                <CheckCircle2 size={13} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-white leading-tight">
                  Certification Complete
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-300 leading-tight">
                  Grade A · All 40 checks passed
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {CHECKLIST_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-primary-surface px-2.5 py-2 sm:px-3 sm:py-2.5"
              >
                <CheckCircle2 size={13} className="shrink-0 text-success" />
                <span className="text-[10px] sm:text-xs font-medium text-black leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
