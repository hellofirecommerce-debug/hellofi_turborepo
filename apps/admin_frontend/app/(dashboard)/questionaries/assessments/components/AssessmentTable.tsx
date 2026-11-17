"use client";
import React from "react";
import { Pencil, Trash2 } from "lucide-react"; // 👈 Import Trash2
import { Button, Badge } from "@repo/ui";
import { Assessment } from "../types";

interface Props {
  data: Assessment[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void; // 👈 Add onDelete
}

export const AssessmentTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
}) => {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        No assessments found
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {data.map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
        >
          <div>
            <p className="font-medium text-gray-800">{a.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {a.category?.name} · {a.totalSteps} steps
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={a.isActive ? "info" : "default"} size="sm">
              {a.isActive ? "ACTIVE" : "INACTIVE"}
            </Badge>

            {/* Edit Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(a.id)}
              className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)]"
            >
              <Pencil size={14} />
            </Button>

            {/* 👇 Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(a.id)}
              className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
