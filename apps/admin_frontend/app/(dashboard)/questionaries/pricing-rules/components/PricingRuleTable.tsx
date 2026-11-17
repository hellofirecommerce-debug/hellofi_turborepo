"use client";
import React from "react";
import { Pencil } from "lucide-react";
import { Button, Badge } from "@repo/ui";
import { PricingRule } from "../types";

interface Props {
  data: PricingRule[];
  onEdit: (id: string) => void;
  loading?: boolean;
}

export const PricingRuleTable: React.FC<Props> = ({
  data,
  onEdit,
  loading,
}) => {
  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        No pricing rules yet
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {data.map((r) => (
        <div
          key={r.id}
          className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
        >
          <div>
            <p className="font-medium text-gray-800">
              {r.ruleName ?? "Untitled Rule"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              On: {r.condition?.title} · Logic: {r.ruleLogic}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="info" size="sm">
              {r.ruleLogic}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(r.id)}
              className="h-8 w-8 border border-gray-200 text-gray-500 hover:border-[rgb(33,76,123)] hover:text-[rgb(33,76,123)]"
            >
              <Pencil size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
