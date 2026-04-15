"use client";
import { useSidebar } from "../../context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";
import { LogOut, MoreVertical, ChevronDown } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { ADMIN_LOGOUT } from "../../lib/graphql/mutations/auth.mutations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AppHeaderProps {
  admin?: { fName: string; lName: string; email: string } | null;
}

const AppHeader: React.FC<AppHeaderProps> = ({ admin }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [adminLogout, { loading: loggingOut }] = useMutation(ADMIN_LOGOUT, {
    onCompleted: () => {
      toast.success("Logged out successfully");
      router.push("/signin");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggle = () => {
    window.innerWidth >= 991 ? toggleSidebar() : toggleMobileSidebar();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullName = admin ? `${admin.fName} ${admin.lName}` : "Admin";
  const initials = admin
    ? `${admin.fName[0]}${admin.lName[0]}`.toUpperCase()
    : "A";

  return (
    <motion.header
      className="sticky top-0 flex w-full bg-white border-gray-200 z-50 lg:border-b"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <SidebarToggleButton isOpen={isMobileOpen} onClick={handleToggle} />

          <Link href="/" className="lg:hidden">
            <Image width={60} height={32} src="/images/logo.webp" alt="Logo" />
          </Link>

          {/* ── Mobile 3-dots menu ── */}
          <div className="relative lg:hidden" ref={mobileDropdownRef}>
            <motion.button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100"
              whileTap={{ scale: 0.9 }}
            >
              <MoreVertical size={20} />
            </motion.button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-64 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50"
                >
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[rgb(33,76,123)] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {fullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {admin?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      adminLogout();
                    }}
                    disabled={loggingOut}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* <div className="hidden lg:block">
            <HeaderSearch />
          </div> */}
        </div>

        {/* ── Desktop right side ── */}
        <div className="hidden lg:flex items-center gap-3 px-4 ml-auto">
          <HeaderActions isOpen={false} />

          {/* ── Admin dropdown ── */}
          <div className="relative" ref={desktopDropdownRef}>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[rgb(33,76,123)] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {initials}
              </div>
              {/* Name + Email */}
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold text-gray-800 leading-tight">
                  {fullName}
                </span>
                <span className="text-xs text-gray-400 leading-tight">
                  {admin?.email}
                </span>
              </div>
              {/* Chevron */}
              <ChevronDown
                size={15}
                className={`text-gray-400 ml-1 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 w-72 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50"
                >
                  {/* Admin info */}
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-[rgb(33,76,123)] flex items-center justify-center text-white text-base font-semibold shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-base font-semibold text-gray-800 truncate">
                        {fullName}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {admin?.email}
                      </p>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      adminLogout();
                    }}
                    disabled={loggingOut}
                    className="flex items-center gap-3 w-full px-5 py-4 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AppHeader;
