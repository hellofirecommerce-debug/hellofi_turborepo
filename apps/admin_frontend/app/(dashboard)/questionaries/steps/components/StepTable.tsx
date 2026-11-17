"use client";
import React from "react";
import { Pencil, Trash2 } from "lucide-react"; // 👈 Import Trash2
import { Button, Badge } from "@repo/ui";
import { Step } from "../types";

interface Props {
  data: Step[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void; // 👈 Add onDelete
}

export const StepTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        No steps found. Pick an assessment above.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {data.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#EEF3FF] flex items-center justify-center text-sm font-semibold text-[rgb(33,76,123)]">
              {s.stepNumber}
            </div>
            <div>
              <p className="font-medium text-gray-800">{s.stepName}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {s.stepCategory} · {s.assessment?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="info" size="sm">
              {s.stepCategory}
            </Badge>

            {/* Edit Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(s.id)}
              className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)]"
            >
              <Pencil size={14} />
            </Button>

            {/* 👇 Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(s.id)}
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
