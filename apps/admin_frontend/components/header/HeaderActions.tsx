"use client";
import { motion } from "motion/react";
// import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
// import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

interface HeaderActionsProps {
  isOpen: boolean;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ isOpen }) => (
  <motion.div
    className={`${isOpen ? "flex" : "hidden"} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
    initial={false}
    animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-2 2xsm:gap-3">
      {/* <ThemeToggleButton /> */}
      {/* <NotificationDropdown /> */}
    </div>
    <UserDropdown />
  </motion.div>
);
