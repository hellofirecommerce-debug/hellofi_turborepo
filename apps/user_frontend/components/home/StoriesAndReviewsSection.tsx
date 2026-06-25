"use client";
import React from "react";
import { motion } from "motion/react";
import { VideoStoryStack } from "./VideoStoryStack";
import { BlogCardColumn } from "./BlogCardColumn";
import { ReviewColumn } from "./ReviewColumn";

export interface VideoStory {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  productName?: string;
  productImage?: string;
  price?: string;
  duration?: string;
}

const colEntrance = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export const StoriesAndReviewsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16">
      <motion.h2
        className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        Stories
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3  md:gap-5 lg:gap-6 xl:gap-6 items-start">
        <motion.div
          {...colEntrance}
          transition={{
            duration: 0.6,
            delay: 0,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        >
          <ReviewColumn />
        </motion.div>
        <motion.div
          {...colEntrance}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        >
          <BlogCardColumn />
        </motion.div>
        <motion.div
          {...colEntrance}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        >
          <ReviewColumn />
        </motion.div>
      </div>
    </section>
  );
};
