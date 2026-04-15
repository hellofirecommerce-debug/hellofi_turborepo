"use client";
import { useSidebar } from "../../context/SidebarContext";
import { motion } from "motion/react";
import React from "react";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;
