"use client";

import { useRequireAuth } from "../../lib/hooks/useAdminAuth";
import AppHeader from "../../components/header/AppHeader";
import AppSidebar from "../../components/layout/AppSidebar";
import Backdrop from "../../components/ui/Backdrop";
import { useSidebar } from "../../context/SidebarContext";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

function DashboardContent({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin?: { fName: string; lName: string; email: string } | null;
}) {
  const { isExpanded, isHovered } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isVisible = isExpanded || isHovered;

  return (
    <motion.div
      className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden"
      animate={{ marginLeft: isMobile ? 0 : isVisible ? 290 : 90 }}
      initial={false}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <AppHeader admin={admin} />
      <main className="flex-1 p-3 lg:p-6 bg-gray-50">
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </main>
    </motion.div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin } = useRequireAuth(); // ← get admin here

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <Backdrop />
      <DashboardContent admin={admin}>{children}</DashboardContent>
    </div>
  );
}
