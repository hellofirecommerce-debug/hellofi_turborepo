"use client";

import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";
import { motion } from "motion/react";

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Stories", href: "/stories" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Shipping & Delivery Policy", href: "/shipping-policy" },
  { label: "Return & Refund Policy", href: "/return-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const QUICK_ACTIONS = [
  { label: "Sell My Device", href: "/sell" },
  { label: "Get Instant Quote", href: "/sell" },
  { label: "Buy a Device", href: "/buy" },
  { label: "Explore Premium", href: "/premium" },
  { label: "Exchange My Device", href: "/exchange" },
];

const SOCIAL_LINKS = [
  {
    href: "https://facebook.com/hellofi",
    label: "Facebook",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com/hellofi",
    label: "Instagram",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://wa.me/918150835583",
    label: "WhatsApp",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/company/hellofi",
    label: "LinkedIn",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com/hellofi",
    label: "Twitter",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const colFade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

export function Footer() {
  return (
    <footer className="bg-[#0d1526] text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Desktop layout */}
        <div className="hidden lg:block">
          <div className="flex flex-row gap-10 xl:gap-14">
            {/* Col 1 — Logo + desc + social */}
            <motion.div
              className="w-[200px] flex-shrink-0 flex flex-col"
              {...colFade}
              transition={{
                duration: 0.6,
                delay: 0,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">H</span>
                </div>
                <span className="font-bold text-white text-lg tracking-tight">
                  HELLOFI
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                India's trusted recommerce platform for buying and selling
                pre-owned electronics.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {SOCIAL_LINKS.map((s, i) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                    whileHover={{ scale: 1.15, y: -2 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Col 2 — Company */}
            <motion.div
              className="flex-1"
              {...colFade}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-5">
                Company
              </p>
              <div className="flex flex-col gap-3">
                {COMPANY_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Col 3 — Support */}
            <motion.div
              className="flex-1"
              {...colFade}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-5">
                Support
              </p>
              <div className="flex flex-col gap-3">
                {SUPPORT_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Col 4 — Quick Actions */}
            <motion.div
              className="flex-1"
              {...colFade}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-5">
                Quick Actions
              </p>
              <div className="flex flex-col gap-3">
                {QUICK_ACTIONS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Col 5 — Find Us */}
            <motion.div
              className="w-[240px]"
              {...colFade}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-5">
                Find Us
              </p>
              <div className="rounded-xl overflow-hidden mb-4 h-[120px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6756993004424!2d77.6334983740949!3d12.928552987382869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae150c3f13efb3%3A0x7c63fb5ed43e5ec!2sHelloFi%20Recommerce!5e0!3m2!1sen!2sin!4v1779693151603!5m2!1sen!2sin"
                  width="100%"
                  height="120"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HelloFi Location"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Phone size={12} className="text-primary flex-shrink-0" />
                  +91 8150835583
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Mail size={12} className="text-primary flex-shrink-0" />
                  contact@hellofi.in
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Clock size={12} className="text-primary flex-shrink-0" />
                  11AM – 9PM (Mon – Sun)
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col gap-8">
          {/* Logo + desc + social */}
          <motion.div {...colFade} transition={{ duration: 0.5, delay: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                HELLOFI
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              India's trusted recommerce platform for buying and selling
              pre-owned electronics.
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  whileHover={{ scale: 1.15, y: -2 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions + Company — 2 col */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            {...colFade}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Quick Actions
              </p>
              <div className="flex flex-col gap-2.5">
                {QUICK_ACTIONS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Company
              </p>
              <div className="flex flex-col gap-2.5">
                {COMPANY_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Support + Find Us — 2 col */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            {...colFade}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Support
              </p>
              <div className="flex flex-col gap-2.5">
                {SUPPORT_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Find Us
              </p>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Phone size={12} className="text-primary flex-shrink-0" />
                  +91 8150835583
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Mail size={12} className="text-primary flex-shrink-0" />
                  contact@hellofi.in
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <Clock size={12} className="text-primary flex-shrink-0" />
                  11AM – 9PM (Mon – Sun)
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map — full width on mobile */}
          <motion.div
            className="rounded-xl overflow-hidden h-[180px]"
            {...colFade}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6756993004424!2d77.6334983740949!3d12.928552987382869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae150c3f13efb3%3A0x7c63fb5ed43e5ec!2sHelloFi%20Recommerce!5e0!3m2!1sen!2sin!4v1779693151603!5m2!1sen!2sin"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="HelloFi Location"
            />
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-gray-700 mt-10 mb-6 sm:mb-0 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xs text-gray-500">
            © 2026 HelloFi Recommerce · GST: 29AAQFH3388A1Z4
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms & Conditions", "Return Policy"].map(
              (l) => (
                <Link
                  key={l}
                  href={`/${l.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {l}
                </Link>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
