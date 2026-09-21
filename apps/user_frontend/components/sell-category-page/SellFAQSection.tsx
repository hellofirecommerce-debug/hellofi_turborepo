"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQAccordionItem } from "../ui/FAQAccordionItem";
import { sellingFAQs } from "../../lib/content/faqs/selling";

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
    <section className="max-w-3xl mx-auto px-4 py-10 sm:py-14 w-full">
      <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-primary mb-2">
        Got Questions?
      </p>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-6 sm:mb-8">
        Frequently Asked Questions
      </h2>

      <div className="flex flex-col gap-3 sm:gap-4">
        {visibleFaqs.map((faq) => (
          <FAQAccordionItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openId === faq.id}
            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
          />
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary text-primary text-xs font-bold tracking-widest uppercase px-5 py-2 hover:bg-primary-surface transition-colors cursor-pointer"
          >
            Load More FAQ
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
