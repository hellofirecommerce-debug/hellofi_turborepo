"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  eyebrow: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  supportHref: string;
}

export function FAQAccordion({
  faqs,
  eyebrow,
  title,
  subtitle,
  supportHref,
}: FAQAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Left */}
        <motion.div
          className="lg:w-[35%]"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <motion.span
            className="inline-block border border-gray-300 text-primary text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5 bg-faq-surface"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {eyebrow}
          </motion.span>
          <motion.h2
            className="text-3xl lg:text-4xl font-extrabold text-black leading-tight mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-gray-500 text-sm leading-relaxed mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link
              href={supportHref}
              className="inline-flex items-center justify-center border-2 border-primary text-primary text-xs font-bold px-6 py-2.5 rounded-full hover:bg-primary hover:text-white transition-colors tracking-widest uppercase"
            >
              Contact Support
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — accordion */}
        <div className="flex-1 flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className={`rounded-2xl border overflow-hidden transition-colors duration-200 ${
                  isOpen
                    ? "border-primary bg-primary-surface"
                    : "border-gray-200 bg-white"
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                >
                  <span
                    className={`text-sm font-semibold leading-snug ${
                      isOpen ? "text-primary" : "text-hf-title"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${
                      isOpen ? "bg-primary" : "bg-gray-100"
                    }`}
                  >
                    {isOpen ? (
                      <Minus size={14} className="text-white" />
                    ) : (
                      <Plus size={14} className="text-gray-500" />
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
                      <div className="px-5 pb-5">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
