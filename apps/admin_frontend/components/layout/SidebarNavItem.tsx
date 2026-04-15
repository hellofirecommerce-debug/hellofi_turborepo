"use client";
import { NavLink } from "../ui/NavLink";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { NavItem } from "./types";

interface SidebarNavItemProps {
  nav: NavItem;
  index: number;
  menuType: "main" | "others";
  isVisible: boolean;
  isOpen: boolean;
  isActive: (path: string) => boolean;
  isParentActive?: boolean;
  subMenuRef: (el: HTMLDivElement | null) => void;
  subMenuHeight: number;
  onToggle: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  nav,
  index,
  isVisible,
  isOpen,
  isActive,
  isParentActive = false,
  subMenuRef,
  subMenuHeight,
  onToggle,
}) => {
  const hasSubItems = !!nav.subItems;
  const isItemActive = nav.path ? isActive(nav.path) : false;

  const baseClass = `flex flex-row items-center gap-3 w-full rounded-lg py-2.5 text-sm font-medium transition-colors duration-150`;
  const activeClass = `bg-blue-50 text-blue-700 font-semibold`;
  const parentActiveClass = `bg-blue-50 text-blue-700 font-semibold`;
  const inactiveClass = `text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
  const expandedPadding = `px-3`;
  const collapsedPadding = `justify-center px-0`;

  return (
    <motion.li
      className="w-full"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04, ease: "easeOut" }}
    >
      {hasSubItems ? (
        <button
          onClick={onToggle}
          className={`${baseClass} ${
            isOpen
              ? activeClass
              : isParentActive
                ? parentActiveClass
                : inactiveClass
          } ${isVisible ? expandedPadding : collapsedPadding}`}
        >
          <motion.span
            className={`shrink-0 ${isOpen || isParentActive ? "text-blue-700" : ""}`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {nav.icon}
          </motion.span>

          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.span
                className={`flex-1 text-left whitespace-nowrap overflow-hidden `}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                {nav.name}
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isVisible && (
              <motion.span
                className="ml-auto shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <ChevronDown
                    size={16}
                    className={isOpen ? "text-blue-700" : "text-gray-400"}
                  />
                </motion.div>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      ) : (
        nav.path && (
          <NavLink
            href={nav.path}
            className={`${baseClass} ${isItemActive ? activeClass : inactiveClass} ${isVisible ? expandedPadding : collapsedPadding}`}
          >
            <motion.span
              className={`shrink-0 ${isItemActive ? "text-blue-700" : ""}`}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {nav.icon}
            </motion.span>
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.span
                  className="flex-1 whitespace-nowrap overflow-hidden"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {nav.name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        )
      )}

      {/* Submenu */}
      {hasSubItems && isVisible && (
        <div
          ref={subMenuRef}
          className="overflow-hidden"
          style={{
            height: isOpen ? `${subMenuHeight}px` : "0px",
            transition: "height 0.3s ease",
          }}
        >
          <ul className="mt-1 space-y-1 ml-9">
            {nav.subItems!.map((subItem, subIndex) => (
              <motion.li
                key={subItem.name}
                initial={{ opacity: 0, x: -6 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                transition={{ duration: 0.18, delay: subIndex * 0.05 }}
              >
                <NavLink
                  href={subItem.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                    isActive(subItem.path)
                      ? "text-blue-700 bg-blue-50 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  {subItem.name}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.li>
  );
};
