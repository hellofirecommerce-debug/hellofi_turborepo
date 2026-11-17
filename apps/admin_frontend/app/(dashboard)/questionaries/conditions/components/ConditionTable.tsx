"use client";
import React from "react";
import { Pencil, ListChecks, Trash2 } from "lucide-react";
import { Button, Badge } from "@repo/ui";
import { Condition } from "../types";

interface Props {
  data: Condition[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onManageOptions: (conditionId: string) => void;
}

export const ConditionTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
  onManageOptions,
}) => {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        No conditions found. Pick a step above.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {data.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">{c.title}</p>
              <Badge variant="info" size="sm">
                {c.conditionType}
              </Badge>
              {c.isRequired && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {c.step?.stepName} · {c.options?.length ?? 0} options
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onManageOptions(c.id)}
              className="gap-1.5 text-xs text-gray-500 hover:text-[rgb(33,76,123)]"
            >
              <ListChecks size={12} />
              Manage Options
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(c.id)}
              className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)]"
            >
              <Pencil size={14} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(c.id)}
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
