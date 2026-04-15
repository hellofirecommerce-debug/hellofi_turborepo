"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";
import * as React from "react";

const buttonVariants = cva(
  "cursor-pointer select-none inline-flex items-center duration-200 justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: "bg-[rgb(33,76,123)] text-white hover:bg-[rgb(28,64,104)]",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 text-gray-700",
        link: "text-[rgb(33,76,123)] underline-offset-4 hover:underline",
        destructive: "bg-red-500 hover:bg-red-600 text-white",
        success: "bg-green-500 hover:bg-green-600 text-white",
        warning: "bg-amber-500 hover:bg-amber-600 text-white",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-7 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-lg",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
