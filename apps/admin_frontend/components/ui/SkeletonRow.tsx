import { TableCell } from "../table/TableCell";
import { TableRow } from "../table/TableRow";

interface SkeletonRowProps {
  colSpan?: number; // ← add
}

export const SkeletonRow = ({ colSpan = 7 }: SkeletonRowProps) => (
  <TableRow>
    {Array.from({ length: colSpan }).map((_, i) => (
      <TableCell key={i}>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </TableCell>
    ))}
  </TableRow>
);
