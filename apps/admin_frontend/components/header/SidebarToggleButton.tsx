"use client";
import { motion } from "motion/react";
import { X, Menu } from "lucide-react";

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({
  isOpen,
  onClick,
}) => (
  <motion.button
    className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg lg:h-11 lg:w-11"
    onClick={onClick}
    whileTap={{ scale: 0.9 }}
    whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    aria-label="Toggle Sidebar"
  >
    <motion.div
      key={isOpen ? "close" : "open"}
      initial={{ opacity: 0, rotate: -90 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{ opacity: 0, rotate: 90 }}
      transition={{ duration: 0.2 }}
    >
      {isOpen ? <X size={20} /> : <Menu size={16} />}
    </motion.div>
  </motion.button>
);
