// components/ui/FAQAccordionItem.tsx
"use client";

import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FAQAccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: FAQAccordionItemProps) {
  return (
    <motion.div
      layout
      className={`w-full rounded-2xl border overflow-hidden transition-colors duration-200 ${
        isOpen
          ? "border-primary bg-primary-surface"
          : "border-gray-200 bg-white"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 text-left gap-4"
      >
        <span
          className={`text-xs sm:text-sm font-semibold leading-snug ${
            isOpen ? "text-primary" : "text-hf-title"
          }`}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center cursor-pointer ${
            isOpen ? "bg-primary" : "bg-gray-100"
          }`}
        >
          {isOpen ? (
            <Minus size={13} className="text-white" />
          ) : (
            <Plus size={13} className="text-gray-500" />
          )}
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98] as const,
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
