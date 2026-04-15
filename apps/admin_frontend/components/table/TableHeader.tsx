import React from "react";

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = "",
}) => (
  <thead className={className}>
    <tr>{children}</tr>
  </thead>
);
