"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "../lib/utils";
import {
  CrossCircledIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type ToastVariant = "success" | "error" | "warning" | "info";

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-6 left-6",
  "top-center": "top-6 left-1/2 -translate-x-1/2",
  "top-right": "top-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-6 right-6",
};

const variantClasses: Record<ToastVariant, string> = {
  success: "bg-green-50 border-green-200 text-green-700",
  error: "bg-red-50 border-red-200 text-red-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
  info: "bg-blue-50 border-blue-200 text-blue-700",
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircledIcon className="w-5 h-5 text-green-500 shrink-0" />,
  error: <CrossCircledIcon className="w-5 h-5 text-red-500 shrink-0" />,
  warning: (
    <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 shrink-0" />
  ),
  info: <InfoCircledIcon className="w-5 h-5 text-blue-500 shrink-0" />,
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
}

export function ToastProvider({
  children,
  position = "bottom-right",
}: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      <ToastPrimitive.Viewport
        className={cn(
          "fixed z-50 flex flex-col gap-2 w-[380px]",
          positionClasses[position],
        )}
      />
    </ToastPrimitive.Provider>
  );
}

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function Toast({
  open,
  onOpenChange,
  message,
  title,
  variant = "info",
  duration = 4000,
}: ToastProps) {
  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0",
        "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
        variantClasses[variant],
      )}
    >
      <div className="mt-0.5">{variantIcons[variant]}</div>
      <div className="flex flex-col gap-0.5">
        {title && (
          <ToastPrimitive.Title className="font-semibold">
            {title}
          </ToastPrimitive.Title>
        )}
        <ToastPrimitive.Description className="opacity-90">
          {message}
        </ToastPrimitive.Description>
      </div>
      <ToastPrimitive.Close className="ml-auto opacity-60 hover:opacity-100">
        <CrossCircledIcon className="w-4 h-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export type { ToastVariant, ToastPosition };
