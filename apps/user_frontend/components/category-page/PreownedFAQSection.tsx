// components/category-page/PreownedFAQSection.tsx
"use client";

import { useState } from "react";
import { FAQAccordionItem } from "../ui/FAQAccordionItem";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const PREOWNED_FAQS: FAQItem[] = [
  {
    id: 1,
    question:
      "Is HelloFi the best site for secondhand electronic gadgets in India?",
    answer:
      "HelloFi is one of India's most trusted platforms for buying and selling used electronics. Every device is quality-checked, honestly graded, and fairly priced — covering phones, laptops, tablets, and smartwatches. HelloFi has a solid catalog with transparent condition grading and honest pricing.",
  },
  {
    id: 2,
    question: "Are secondhand devices reliable?",
    answer:
      "Yes, when bought from the right place. Every device on HelloFi is inspected and tested before listing, with a clear condition grade so you know exactly what you're getting. Thousands of customers have bought from HelloFi and come back for more — that kind of repeat trust doesn't happen with unreliable products.",
  },
  {
    id: 3,
    question:
      "Can I get a premium preowned device with brand warranty under 20,000?",
    answer:
      "Absolutely. This is one of the biggest reasons people shop on HelloFi. You can find flagship smartphones, Apple devices, Samsung Galaxy series, and more all with remaining brand warranty and also device well under ₹20,000.",
  },
  {
    id: 4,
    question:
      "Do used devices on HelloFi come with the original box, accessories, and bill?",
    answer:
      "It depends on the listing. HelloFi mentions this clearly on each product page, so check the details before buying — no hidden surprises.",
  },
  {
    id: 5,
    question:
      "Can I claim the remaining brand warranty on devices sold by HelloFi that are listed with brand warranty?",
    answer:
      "Yes. If a device on HelloFi is listed with brand warranty, the remaining warranty is valid and claimable directly with the brand's service center. You can walk into any authorized service center with the device and get it serviced under the original manufacturer's warranty just like you would if you'd bought it new.",
  },
  {
    id: 6,
    question: "Why do customers trust HelloFi?",
    answer:
      "Thorough quality checks, honest condition grading, fair pricing, and strong after-sales support. Thousands of happy customers across India keep coming back.",
  },
  {
    id: 7,
    question:
      "Can I pay through Cash on Delivery (COD) or No-Cost EMI on HelloFi?",
    answer:
      "Yes, to both. HelloFi supports Cash on Delivery for customers who prefer to pay when the product arrives. No-Cost EMI options are also available, making it easy to spread out payments without paying extra interest. So, whether you want the comfort of COD or the flexibility of EMI, HelloFi has you covered.",
  },
  {
    id: 8,
    question: "How quickly are orders shipped and delivered on HelloFi?",
    answer:
      "Orders are typically dispatched on the same business day if ordered before 10AM and delivery usually takes 3-5 business days depending on your location. Metro cities tend to get faster delivery, while remote areas may take a little longer. You get tracking details as soon as it's dispatched.",
  },
  {
    id: 9,
    question: "What does certified preowned mean on HelloFi?",
    answer:
      "Certified preowned on HelloFi means the device has been sourced directly from its original owner, tested across 40 quality checkpoints, honestly graded, and listed in the exact condition it was received without any repairs, part replacements, or alterations. Real photos. Honest description. No hidden history.",
  },
  {
    id: 10,
    question: "Are devices on HelloFi repaired or altered before being sold?",
    answer:
      "No. HelloFi does not repair, open, or alter any device after receiving it from the seller. Every device is sold in its original as-received condition. If a device has a cosmetic mark or functional issue, it is disclosed in the listing not fixed and presented as like-new.",
  },
  {
    id: 11,
    question: "Do HelloFi devices come with a warranty?",
    answer:
      "Yes. Every device purchased on HelloFi comes with a Brand warranty or 3-month HelloFi service warranty covering functional defects. If a device develops a hardware fault within the warranty period, HelloFi will repair or replace it at no cost to you.",
  },
  {
    id: 12,
    question: "Can I return a device if it does not match the listing?",
    answer:
      "Yes. A detailed video proof of unboxing will be required to proof the claim. Just WhatsApp us immediately and we will resolve the claim in no time.",
  },
  {
    id: 13,
    question: "Is iCloud Activation Lock removed on iPhones sold on HelloFi?",
    answer:
      "Yes. Before listing any iPhone, HelloFi verifies that iCloud Activation Lock is fully removed and the device is not linked to a previous owner's Apple ID. You can set it up with your own Apple ID immediately on arrival.",
  },
  {
    id: 14,
    question: "How is battery health disclosed on HelloFi listings?",
    answer:
      "Battery health is shown in every listing. For iPhones, battery health percentage is displayed. For MacBooks, battery cycle count and health percentage are listed. For Android phones and Windows laptops, battery condition and estimated capacity are noted. You always know before you buy.",
  },
  {
    id: 15,
    question: "Is buying a preowned phone or laptop on HelloFi worth it?",
    answer:
      "For most buyers in India, yes, significantly. Certified preowned devices on HelloFi are 30 to 60 percent cheaper than new, with the same hardware, same software experience, and same daily performance. Backed by a 3-month warranty and 5-day returns, the value case is strong.",
  },
];

export function PreownedFAQSection() {
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
        {PREOWNED_FAQS.map((faq) => (
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
