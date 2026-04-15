"use client";
import { motion, AnimatePresence } from "motion/react";
import { MoreHorizontal } from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";
import { NavItem } from "./types";

interface SidebarSectionProps {
  label: string;
  items: NavItem[];
  menuType: "main" | "others";
  isVisible: boolean;
  openSubmenu: { type: "main" | "others"; index: number } | null;
  subMenuRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  subMenuHeight: Record<string, number>;
  isActive: (path: string) => boolean;
  isParentActive: (nav: NavItem) => boolean;
  onToggle: (index: number, menuType: "main" | "others") => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  label,
  items,
  menuType,
  isVisible,
  openSubmenu,
  subMenuRefs,
  subMenuHeight,
  isActive,
  isParentActive,
  onToggle,
}) => (
  <div className="w-full">
    <div
      className={`mb-3 flex ${isVisible ? "justify-start px-3" : "justify-center"}`}
    >
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.span
            key="label"
            className="text-xs font-semibold uppercase tracking-wider text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        ) : (
          <motion.span
            key="dots"
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <MoreHorizontal size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </div>

    <ul className="flex flex-col gap-1 w-full">
      {items.map((nav, index) => (
        <SidebarNavItem
          key={nav.name}
          nav={nav}
          index={index}
          menuType={menuType}
          isVisible={isVisible}
          isOpen={
            openSubmenu?.type === menuType && openSubmenu?.index === index
          }
          isActive={isActive}
          isParentActive={isParentActive(nav)}
          subMenuRef={(el) => {
            subMenuRefs.current[`${menuType}-${index}`] = el;
          }}
          subMenuHeight={subMenuHeight[`${menuType}-${index}`] ?? 0}
          onToggle={() => onToggle(index, menuType)}
        />
      ))}
    </ul>
  </div>
);
