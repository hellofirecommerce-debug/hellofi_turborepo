import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered";
}

export const Table: React.FC<TableProps> = ({
  children,
  className = "",
  variant = "default",
}) => (
  <table
    className={`w-full border-collapse ${
      variant === "bordered" ? "border border-gray-200" : ""
    } ${className}`}
  >
    {children}
  </table>
);
