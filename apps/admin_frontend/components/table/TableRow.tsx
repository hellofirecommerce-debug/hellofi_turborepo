import React from "react";

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "bordered";
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
  onClick,
  variant = "default",
}) => (
  <tr
    onClick={onClick}
    className={`
      transition-colors
      ${variant === "bordered" ? "border border-gray-200" : "border-b border-gray-100"}
      ${onClick ? "cursor-pointer" : ""}
      hover:bg-gray-50
      ${className}
    `}
  >
    {children}
  </tr>
);
