"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useSidebar } from "../../context/SidebarContext";
import {
  LayoutDashboard,
  Tag,
  Package,
  ShoppingCart,
  PieChart,
  Layers,
  KeyRound,
  ShoppingBag,
} from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarSection } from "./SidebarSection";

import { NavItem } from "./types";

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/home",
  },
  {
    icon: <Tag size={20} />,
    name: "Catalogue", // ← one item, two sub pages
    subItems: [
      { name: "Brands", path: "/brands" },
      { name: "Categories", path: "/categories" },
      { name: "Series", path: "/series" },
    ],
  },
  {
    icon: <ShoppingBag size={20} />,
    name: "Selling",
    subItems: [
      { name: "All Products", path: "/selling/products" },
      { name: "Add Product", path: "/selling/products/create" },
    ],
  },
  {
    icon: <Package size={20} />,
    name: "Inventory",
    subItems: [
      { name: "All Products", path: "/inventory" },
      { name: "Add Product", path: "/inventory/add" },
      { name: "All Invoices", path: "/inventory/invoices" },
      { name: "Create Invoice", path: "/inventory/invoices/create" },
      { name: "Settings", path: "/inventory/settings" },
    ],
  },
  {
    icon: <ShoppingCart size={20} />,
    name: "Orders",
    path: "/dashboard/orders",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChart size={20} />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <Layers size={20} />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <KeyRound size={20} />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const isVisible = isExpanded || isHovered || isMobileOpen;

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      const normalized = path.startsWith("/") ? path : `/${path}`;
      // ← exact match only
      return pathname === normalized;
    },
    [pathname],
  );

  const isParentActive = useCallback(
    (nav: NavItem) => {
      if (!nav.subItems) return false;
      return nav.subItems.some((sub) => {
        const normalized = sub.path.startsWith("/") ? sub.path : `/${sub.path}`;
        return pathname === normalized || pathname.startsWith(normalized + "/");
      });
    },
    [pathname],
  );
  useEffect(() => {
    let matched = false;
    (["main", "others"] as const).forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        nav.subItems?.forEach((subItem) => {
          const normalized = subItem.path.startsWith("/")
            ? subItem.path
            : `/${subItem.path}`;
          if (
            pathname === normalized ||
            pathname.startsWith(normalized + "/")
          ) {
            setOpenSubmenu({ type: menuType, index });
            matched = true;
          }
        });
      });
    });
    if (!matched) setOpenSubmenu(null);
  }, [pathname]); // ← remove isActive from deps, use inline normalization

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev?.index === index
        ? null
        : { type: menuType, index },
    );
  };

  return (
    <motion.aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen z-50 border-r border-gray-200 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      animate={{ width: isVisible ? 290 : 90 }}
      initial={false}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarLogo isVisible={isVisible} />

      <div className="flex-1 overflow-y-auto mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <SidebarSection
              label="Menu"
              items={navItems}
              menuType="main"
              isVisible={isVisible}
              openSubmenu={openSubmenu}
              subMenuRefs={subMenuRefs}
              subMenuHeight={subMenuHeight}
              isActive={isActive}
              isParentActive={isParentActive}
              onToggle={handleSubmenuToggle}
            />
            <SidebarSection
              label="Others"
              items={othersItems}
              menuType="others"
              isVisible={isVisible}
              openSubmenu={openSubmenu}
              subMenuRefs={subMenuRefs}
              subMenuHeight={subMenuHeight}
              isActive={isActive}
              isParentActive={isParentActive}
              onToggle={handleSubmenuToggle}
            />
          </div>
        </nav>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
