"use client";

import { useState } from "react";
import { FAQAccordionItem } from "../../ui/FAQAccordionItem";
import { buyingFAQs } from "../../../lib/content/faqs/buying";

interface Props {
  categorySlug: string;
}

export function CategoryFAQSection({ categorySlug }: Props) {
  const [openId, setOpenId] = useState<number | null>(null);
  const faqs = buyingFAQs[categorySlug];

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 sm:py-14 w-full">
      <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-primary mb-2">
        Got Questions?
      </p>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-6 sm:mb-8">
        Frequently Asked Questions
      </h2>

      <div className="flex flex-col gap-3 sm:gap-4">
        {faqs.map((faq) => (
          <FAQAccordionItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openId === faq.id}
            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
          />
        ))}
      </div>
    </section>
  );
}
