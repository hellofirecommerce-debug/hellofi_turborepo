"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setLoading(false);
      setPrevPath(pathname);
    }
  }, [pathname]);

  // Expose trigger globally
  useEffect(() => {
    (window as any).__startNavigation = () => setLoading(true);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-[3px] border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}
