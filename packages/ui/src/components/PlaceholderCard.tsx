import { cn } from "../lib/utils";
import React from "react";

interface PlaceholderCardProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}

export function PlaceholderCard({
  width = "100%",
  height = 200,
  className,
  label,
  style,
}: PlaceholderCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gray-200 flex items-center justify-center ",
        className,
      )}
      style={{ width, height, ...style }}
    >
      {label && (
        <span className="text-gray-400 text-xs font-medium">{label}</span>
      )}
    </div>
  );
}
