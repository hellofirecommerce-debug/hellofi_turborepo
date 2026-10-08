"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

interface Props extends HTMLMotionProps<"div"> {
  delay?: number;
}

export const MotionCard = forwardRef<HTMLDivElement, Props>(function MotionCard(
  { delay = 0, children, ...rest },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 300, damping: 28, delay }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
