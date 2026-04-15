"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { cn } from "../lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="dialog"
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                  variant === "danger" ? "bg-red-50" : "bg-yellow-50",
                )}
              >
                <AlertTriangle
                  size={22}
                  className={
                    variant === "danger" ? "text-red-500" : "text-yellow-500"
                  }
                />
              </div>

              {/* Content */}
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                {title}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{description}</p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {cancelLabel}
                </Button>
                <Button
                  size="sm"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    "flex-1",
                    variant === "danger"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white",
                  )}
                >
                  {isLoading ? "Deleting..." : confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
