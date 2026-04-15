import React from "react";

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = "",
}) => (
  <tbody className={`divide-y divide-gray-100 ${className}`}>{children}</tbody>
);
