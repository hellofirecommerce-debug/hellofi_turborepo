"use client";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const inputVariants = cva(
  "w-full min-w-0 rounded-md border border-gray-300 bg-white text-gray-900 transition-[color,box-shadow] outline-none placeholder:text-gray-400 focus-visible:border-[rgb(33,76,123)] focus-visible:ring-[rgb(33,76,123)]/25 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
  {
    variants: {
      inputSize: {
        sm: "h-7 px-2 py-1 text-xs",
        default: "h-9 px-3 py-1 text-sm",
        md: "h-10 px-3 py-1.5 text-sm",
        lg: "h-11 px-4 py-2 text-base",
        xl: "h-12 px-4 py-2.5 text-lg",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>;

export function Input({ className, type, inputSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize }), className)}
      {...props}
    />
  );
}
