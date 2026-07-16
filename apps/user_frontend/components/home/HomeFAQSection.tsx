import { FAQAccordion, type FAQItem } from "../ui/FAQAccordion";

const HOME_FAQS: FAQItem[] = [
  {
    id: 1,
    question:
      "How do I sell my old phone or laptop on HelloFi and get instant payment?",
    answer:
      "Just 3 steps — get an instant price quote on HelloFi.in, schedule a free doorstep pickup, and receive instant payment via UPI or bank transfer on the spot. No bargaining. No hidden deductions.",
  },
  {
    id: 2,
    question: "What gadgets does HelloFi buy and sell?",
    answer:
      "We buy and sell smartphones (iPhone, Samsung, OnePlus, Xiaomi & more), laptops, MacBooks, tablets, iPads, and smartwatches. All sold devices are quality-checked and come with warranty.",
  },
  {
    id: 3,
    question: "Is it safe to buy a used phone from HelloFi?",
    answer:
      "Yes! Every device goes through a 32-point quality check covering display, battery, camera, and all hardware. Devices come with warranty and are factory reset before delivery to protect your data.",
  },
  {
    id: 4,
    question: "How is the price of my old device calculated?",
    answer:
      "Your price is based on brand, model, storage, age, physical condition, and accessories like the original box and charger. The price we quote is exactly what you get paid — no last-minute deductions.",
  },
  {
    id: 5,
    question: "Does HelloFi offer doorstep pickup — which cities do you serve?",
    answer:
      "Yes! HelloFi offers free doorstep pickup across 15+ cities including Bangalore, Hyderabad, Mumbai, Mysore, Bhubaneswar & Agartala.",
  },
];

export function HomeFAQSection() {
  return (
    <FAQAccordion
      faqs={HOME_FAQS}
      eyebrow="Got Questions?"
      title={
        <>
          Frequently
          <br />
          Asked
          <br />
          <span className="text-primary">Questions</span>
        </>
      }
      subtitle={
        <>
          Can&apos;t find the answer you&apos;re looking for?
          <br />
          Reach out to our customer support team.
        </>
      }
      supportHref="/support"
    />
  );
}
