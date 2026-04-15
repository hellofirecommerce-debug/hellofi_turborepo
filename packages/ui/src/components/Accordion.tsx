"use client";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function Accordion({
  title,
  isExpanded,
  onToggle,
  children,
}: AccordionProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {isExpanded && <div className="p-4 flex flex-col gap-3">{children}</div>}
    </div>
  );
}
