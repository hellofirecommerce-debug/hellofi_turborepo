import React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center font-medium rounded-full border transition-colors",
  {
    variants: {
      variant: {
        success: "bg-green-50 text-green-700 border-green-200",
        error: "bg-red-50 text-red-700 border-red-200",
        warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
        info: "bg-blue-50 text-blue-700 border-blue-200",
        default: "bg-gray-50 text-gray-700 border-gray-200",
        active: "bg-green-50 text-green-700 border-green-200",
        inactive: "bg-red-50 text-red-700 border-red-200",
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        new: "bg-blue-50 text-blue-700 border-blue-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
