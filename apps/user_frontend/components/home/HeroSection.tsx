"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@repo/ui";
import { HeroImages } from "./HeroImages";
import { TrustBadges } from "./TrustBadges";

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 lg:pt-16 lg:pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
        {/* Right — Hero images */}
        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroImages />
        </motion.div>

        {/* Left — Text content */}
        <motion.div
          className="order-2 lg:order-1 flex-1 max-w-lg flex flex-col lg:items-start lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Sustainable Tech Platform
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1a1a2e] leading-tight mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Buy. Sell.
            <br />
            Exchange.
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            India's Most Trusted Platform for Buying & Selling Pre-Owned
            Electronics. Get the Best Value for Your Old Devices and Shop
            Premium Pre-Owned Gadgets at Unbeatable Prices Tested, Warranty
            Assured, and Available with Easy EMI Options.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-full bg-primary-light text-white hover:bg-primary-light-hover"
            >
              <Link href="/buy">Buy Preowned</Link>
            </Button>
            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-full bg-primary text-white hover:bg-primary-hover"
            >
              <Link href="/sell">Sell Your Gadget</Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <TrustBadges />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
