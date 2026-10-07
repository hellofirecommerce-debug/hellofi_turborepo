// components/sell-category-page/SellFAQSection.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { FAQAccordionItem } from "../../../ui/FAQAccordionItem";
import { sellingFAQs } from "../../../../lib/content/faqs/selling";

const INITIAL_VISIBLE = 5;

interface Props {
  categorySlug: string;
}

export function SellFAQSection({ categorySlug }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const faqs = sellingFAQs[categorySlug];

  if (!faqs || faqs.length === 0) return null;

  const visibleFaqs = showAll ? faqs : faqs.slice(0, INITIAL_VISIBLE);
  const hasMore = faqs.length > INITIAL_VISIBLE;

  return (
    <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16 w-full">
      <p className="inline-flex rounded-full bg-[#0066FF]/10 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0066FF]">
        Got Questions?
      </p>
      <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black">
        Frequently Asked Questions
      </h2>
      <span className="mt-4 mb-8 block h-1 w-16 rounded-full bg-gradient-to-r from-[#0066FF] to-[#38BDF8]" />

      <div className="flex flex-col gap-3 sm:gap-4">
        {visibleFaqs.map((faq, i) => (
          <motion.div
            key={faq.id}
            // first batch renders instantly (no hidden state); extras animate in
            initial={i >= INITIAL_VISIBLE ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: Math.max(0, (i - INITIAL_VISIBLE) * 0.05),
              ease: "easeOut",
            }}
          >
            <FAQAccordionItem
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          </motion.div>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="flex justify-center mt-8 sm:mt-10">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#0066FF] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0066FF] shadow-sm transition-all duration-300 hover:bg-[#0066FF] hover:text-white hover:shadow-lg hover:shadow-blue-500/25"
          >
            Load More FAQ
            <ChevronDown
              size={14}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </button>
        </div>
      )}
    </section>
  );
}
