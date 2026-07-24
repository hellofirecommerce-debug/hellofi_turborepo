// components/category-page/mobile/MobileFAQSection.tsx
"use client";

import { useState } from "react";
import { FAQAccordionItem } from "../../../ui/FAQAccordionItem";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const MOBILE_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "How do I buy a secondhand mobile phone online?",
    answer:
      "On HelloFi, select a Phone, Check its Grade, Warranty and Accessories available, Pay, and Get it delivered. Every device is tested before listing.",
  },
  {
    id: 2,
    question:
      "What is the difference between 'used', 'refurbished' and 'open box' phones?",
    answer:
      "Used means sold as it is with quality check. Refurbished are parts-replaced and repaired. Open box are unused, basically new (fresh out of HelloFi's stock).",
  },
  {
    id: 3,
    question: "How do I know if a preowned device is genuine?",
    answer:
      "Match the IMEI/Serial Number to the box and Bill. HelloFi verifies this and tests every phone before listing.",
  },
  {
    id: 4,
    question: "What is a preowned mobile phone?",
    answer:
      "A phone with at least one previous owner. HelloFi grades each one so you know its exact condition.",
  },
  {
    id: 5,
    question: "Are secondhand phones worth buying in 2026?",
    answer:
      "Yes, older flagships beat new budget phones at a lower price. HelloFi's testing process handles the mismatch/hidden damage.",
  },
  {
    id: 6,
    question: "What condition grades does HelloFi offer?",
    answer:
      "From open box (like new) to Superb (lightly used) to Good/visibly used, each condition clearly defined with photos.",
  },
  {
    id: 7,
    question: "Is it safe to buy a secondhand iPhone online in India?",
    answer:
      "Yes, if the seller checks IMEI, tests the phone, and gives a warranty with GST bill. HelloFi covers all.",
  },
  {
    id: 8,
    question:
      "Do you procure the devices from Vendors/Dealers or Direct Customers?",
    answer:
      "Direct from customers. HelloFi doesn't source through bulk dealers, which means there's a clear history on every device and that's what makes accurate grading and warranties possible.",
  },
  {
    id: 9,
    question:
      "How does HelloFi ensure the device they buy has no repair history?",
    answer:
      "Every phone gets a physical and technical inspection, plus IMEI checks, before HelloFi buys it.",
  },
];

export function MobileFAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-primary mb-2">
        Got Questions?
      </p>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-6 sm:mb-8">
        Frequently Asked Questions
      </h2>

      <div className="flex flex-col gap-3 sm:gap-4">
        {MOBILE_FAQS.map((faq) => (
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
