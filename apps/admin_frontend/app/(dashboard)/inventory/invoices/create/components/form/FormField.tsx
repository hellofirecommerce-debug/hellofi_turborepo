"use client";
import { Input, Label } from "@repo/ui";

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  colSpan?: boolean;
  readOnly?: boolean;
}

export function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  colSpan,
  readOnly, // ← add this
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${colSpan ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly} // ← add this
        className={readOnly ? "bg-gray-100 cursor-not-allowed" : ""}
      />
    </div>
  );
}
