"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type SidebarContextValue = {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  setIsHovered: (value: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const value = useMemo<SidebarContextValue>(
    () => ({
      isExpanded,
      isHovered,
      isMobileOpen,
      setIsHovered,
      toggleSidebar: () => setIsExpanded((v) => !v),
      toggleMobileSidebar: () => setIsMobileOpen((v) => !v),
    }),
    [isExpanded, isHovered, isMobileOpen],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}
