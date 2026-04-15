"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

interface SidebarLogoProps {
  isVisible: boolean; // isExpanded || isHovered || isMobileOpen
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ isVisible }) => (
  <div
    className={`pt-5  lg:py-8  flex ${!isVisible ? "lg:justify-center" : "justify-start"}`}
  >
    <Link href="/">
      <motion.div
        key={isVisible ? "full" : "icon"}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {isVisible ? (
          <>
            <Image
              className="hidden lg:flex"
              src="/images/logo.webp"
              alt="Logo"
              width={60}
              height={40}
            />
          </>
        ) : (
          <Image src="/images/logo.webp" alt="Logo" width={32} height={32} />
        )}
      </motion.div>
    </Link>
  </div>
);
