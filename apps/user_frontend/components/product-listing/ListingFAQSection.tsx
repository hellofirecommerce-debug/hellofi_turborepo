// components/product-listing/ListingFAQSection.tsx
"use client";

import { useState } from "react";
import { FAQAccordionItem } from "../ui/FAQAccordionItem";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const LISTING_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Is it worth buying a used mobile online?",
    answer:
      "Yes, as long as you are buying from the right place. Platforms like HelloFi inspect and grade every phone before listing it. You get a clear idea of the phone's condition, fair pricing, and with a proper quality check. For most people, a quality preowned phone from a trusted platform is a smarter buy than a brand-new mid-range.",
  },
  {
    id: 2,
    question: "How long do used smartphones last?",
    answer:
      "A well-maintained phone lasts 4 to 6 years from purchase. Buy a one- or two-year-old phone from HelloFi and you are realistically looking at 3 to 4 more good years of use, sometimes longer.",
  },
  {
    id: 3,
    question: "Which phone brand has the best resale value?",
    answer:
      "Apple holds its value better than any other brand. iPhones depreciate slowly, which makes them pricier on the secondhand market but also a smarter buy if you plan to resell later. After Apple, Samsung (S and Z series) and Google Pixel retain value well.",
  },
  {
    id: 4,
    question: "How much can I save by buying preowned?",
    answer:
      "Typically, 30% to 50% off retail. A phone originally priced at Rs. 80,000 could be available on HelloFi for Rs. 40,000 to Rs. 50,000, same hardware, lower price.",
  },
  {
    id: 5,
    question: "Are preowned phones environmentally friendly?",
    answer:
      "Yes. Making a new phone uses a lot of resources. Buying preowned extends the life of an existing device and keeps it out of e-waste. HelloFi is built around exactly this — giving good electronics a second life.",
  },
  {
    id: 6,
    question: "Which smartphones are best for AI?",
    answer:
      "Samsung Galaxy S26 Ultra, iPhone 17 series, Google Pixel 10 series are the top picks right now. All three run on-device AI features. You can find recent-gen models across all three brands on HelloFi at much better prices than buying new.",
  },
];

export function ListingFAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-primary mb-2">
        Got Questions?
      </p>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-6 sm:mb-8">
        Frequently Asked Questions
      </h2>

      <div className="flex flex-col gap-3 sm:gap-4">
        {LISTING_FAQS.map((faq) => (
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
