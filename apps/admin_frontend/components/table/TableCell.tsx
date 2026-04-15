import React from "react";

interface TableCellProps {
  children?: React.ReactNode;
  isHeader?: boolean;
  className?: string;
  colSpan?: number;
  variant?: "default" | "bordered";
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className = "",
  colSpan,
  variant = "default",
}) => {
  const borderedClass = variant === "bordered" ? "border border-gray-200" : "";

  if (isHeader) {
    return (
      <th
        colSpan={colSpan}
        className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 ${borderedClass} ${className}`}
      >
        {children}
      </th>
    );
  }
  return (
    <td
      colSpan={colSpan}
      className={`px-4 py-3 text-sm text-gray-700 ${borderedClass} ${className}`}
    >
      {children}
    </td>
  );
};
