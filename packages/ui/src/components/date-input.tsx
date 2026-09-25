// packages/ui/src/date-input.tsx
import React from "react";

export interface DateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  value?: string; // "YYYY-MM-DD" or empty string
  onChange?: (value: string) => void;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ value = "", onChange, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25 ${className}`}
        {...props}
      />
    );
  },
);

DateInput.displayName = "DateInput";
