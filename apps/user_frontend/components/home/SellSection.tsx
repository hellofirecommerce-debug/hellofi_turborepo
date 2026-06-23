"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Grid3X3,
} from "lucide-react";
import { Button } from "@repo/ui";

const CATEGORIES = [
  { label: "Mobiles", icon: Smartphone, href: "/sell/mobiles" },
  { label: "Laptops", icon: Laptop, href: "/sell/laptops" },
  { label: "MacBook", icon: Monitor, href: "/sell/macbook" },
  { label: "Tablets", icon: Tablet, href: "/sell/tablets" },
  { label: "Smartwatches", icon: Watch, href: "/sell/smartwatches" },
  { label: "Other Gadgets", icon: Headphones, href: "/sell/other" },
];

export function SellSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-black mb-2">
            What Are You Selling Today?
          </h2>
          <p className="text-sm text-gray-500 max-w-4xl">
            Get the Best Price for Your Old & Used Electronics with Same-Day
            Free Doorstep Pickup. No Hidden Charges, No Hassle, No Last Minute
            Negotiations and No Third Party Pickup Executives Just a Smooth,
            Transparent, and Trusted Experience.
          </p>
        </div>
        <div className="hidden lg:block flex-shrink-0">
          <Button
            asChild
            variant="default"
            size="lg"
            style={{ color: "#ffffff" }}
            className="rounded-full bg-primary hover:bg-primary-hover w-full"
          >
            <Link href="/sell">START SELLING</Link>
          </Button>
        </div>
      </div>

      {/* 50-50 split */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
        {/* Left — 50% */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4 flex items-center gap-2">
            <Grid3X3 size={16} className="text-primary" />
            Sell by Product
          </p>
          {/* 2 cols on mobile, 3 cols on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
            {CATEGORIES.map(({ label, icon: Icon, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={href}
                  className="flex flex-col items-center justify-center gap-2 border-2 border-gray-200 rounded-2xl py-6 px-3 hover:border-primary hover:bg-primary-surface transition-colors group h-full"
                >
                  <div className="w-11 h-11 rounded-full bg-primary-surface flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Icon
                      size={20}
                      className="text-primary group-hover:text-white transition-colors"
                    />
                  </div>
                  <span className="text-xs font-semibold text-black text-center">
                    {label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — 50%, desktop only, matches left height */}
        <div className="hidden lg:flex gap-3 w-full lg:w-1/2">
          <motion.div
            className="flex-1 rounded-2xl overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/images/sell/sell-smartwatch.jpg"
              alt="Smartwatch"
              fill
              className="object-cover object-center"
            />
          </motion.div>
          <motion.div
            className="flex-1 rounded-2xl overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/images/sell/sell-earbuds.jpg"
              alt="Earbuds"
              fill
              className="object-cover object-center"
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile start selling button */}
      <div className="lg:hidden mt-6">
        <Button
          asChild
          variant="default"
          size="lg"
          style={{ color: "#ffffff" }}
          className="rounded-full bg-primary hover:bg-primary-hover w-full"
        >
          <Link href="/sell">Start Selling</Link>
        </Button>
      </div>
    </section>
  );
}
