"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function HeroImages() {
  return (
    <>
      {/* Desktop: tall phone + 2 stacked */}
      <div className="hidden lg:flex items-start gap-3 flex-shrink-0">
        {/* Main tall phone */}
        <motion.div
          className="rounded-2xl overflow-hidden w-[280px] h-[390px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -6 }}
        >
          <Image
            src="/images/home/hero-phone.jpg"
            alt="Featured phone"
            width={280}
            height={390}
            className="object-cover w-full h-full"
            priority
          />
        </motion.div>

        {/* Right stacked */}
        <div className="flex flex-col gap-3">
          <motion.div
            className="rounded-2xl overflow-hidden w-[280px] h-[200px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ y: -6 }}
          >
            <Image
              src="/images/home/hero-technician.png"
              alt="Technician"
              width={280}
              height={200}
              className="object-cover w-full h-full"
            />
          </motion.div>
          <motion.div
            className="rounded-2xl overflow-hidden w-[280px] h-[180px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -6 }}
          >
            <Image
              src="/images/home/hero-snapmint.jpg"
              alt="Snapmint EMI"
              width={280}
              height={180}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile: 2 side-by-side */}
      <div className="flex lg:hidden gap-3">
        <motion.div
          className="flex-1 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Image
            src="/images/home/hero-mobile-1.jpg"
            alt="Unboxing"
            width={600}
            height={400}
            className="object-cover w-full h-[160px]"
          />
        </motion.div>
        <motion.div
          className="flex-1 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            src="/images/home/hero-mobile-2.jpg"
            alt="Smartwatch"
            width={600}
            height={400}
            className="object-cover w-full h-[160px]"
          />
        </motion.div>
      </div>
    </>
  );
}
