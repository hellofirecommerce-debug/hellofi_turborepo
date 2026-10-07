// components/sell/sell-product-pages/components/PrivacySupportBar.tsx
import { Shield, Lock, CircleHelp } from "lucide-react";

export function PrivacySupportBar() {
  return (
    <div className="mt-2 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex items-center gap-3">
        <span className="relative flex h-9 w-8 flex-shrink-0 items-center justify-center">
          <Shield
            className="absolute inset-0 h-full w-full fill-[#34436B] text-[#34436B]"
            strokeWidth={1.5}
          />
          <Lock size={13} className="relative text-white" />
        </span>
        <span>100% privacy protected valuations</span>
      </div>

      <span
        aria-hidden="true"
        className="hidden h-8 w-px bg-gray-200 sm:block"
      />

      <div className="flex items-center gap-2.5">
        <CircleHelp
          size={26}
          strokeWidth={1.5}
          className="flex-shrink-0 text-gray-500"
        />
        <span>
          Can&apos;t find your variant?{" "}
          <a
            href="/contact"
            className="font-semibold text-[#0066FF] underline underline-offset-2 transition-colors hover:text-[#0052cc]"
          >
            Contact Support
          </a>
        </span>
      </div>
    </div>
  );
}
