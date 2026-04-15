// src/hooks/useNavigate.ts
"use client";
import { useRouter } from "next/navigation";

export function useNavigate() {
  const router = useRouter();

  const navigate = (path: string) => {
    (window as any).__startNavigation?.();
    router.push(path);
  };

  return { navigate };
}
