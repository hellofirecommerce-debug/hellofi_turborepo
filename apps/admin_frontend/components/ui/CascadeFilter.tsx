"use client";
import React from "react";
import { useQuery } from "@apollo/client/react";
import { Label } from "@repo/ui";
import { GET_CATEGORIES } from "../../lib/graphql/queries/category.queries";
import { GET_ASSESSMENTS } from "../../lib/graphql/queries/assessment.queries";
import { GET_STEPS } from "../../lib/graphql/queries/assessment.queries";
import { GET_CONDITIONS } from "../../lib/graphql/queries/condition.queries";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

interface FilterValue {
  categoryId?: string;
  assessmentId?: string;
  stepId?: string;
  conditionId?: string;
}

interface Props {
  value: FilterValue;
  onChange: (key: keyof FilterValue, value: string | undefined) => void;
  levels?: ("category" | "assessment" | "step" | "condition")[];
}

export const CascadeFilter: React.FC<Props> = ({
  value,
  onChange,
  levels = ["category", "assessment", "step"],
}) => {
  const { data: catData } = useQuery<any>(GET_CATEGORIES);
  const { data: assessData } = useQuery<any>(GET_ASSESSMENTS, {
    variables: { categoryId: value.categoryId },
    skip: !value.categoryId,
  });
  const { data: stepData } = useQuery<any>(GET_STEPS, {
    variables: { assessmentId: value.assessmentId },
    skip: !value.assessmentId,
  });
  const { data: condData } = useQuery<any>(GET_CONDITIONS, {
    variables: { filter: { stepId: value.stepId, pageSize: 200 } },
    skip: !value.stepId,
  });

  const resetBelow = (key: keyof FilterValue) => {
    const order: (keyof FilterValue)[] = [
      "categoryId",
      "assessmentId",
      "stepId",
      "conditionId",
    ];
    const idx = order.indexOf(key);
    if (idx === -1) return;
    order.slice(idx + 1).forEach((k) => onChange(k, undefined));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {levels.includes("category") && (
        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <select
            value={value.categoryId ?? ""}
            onChange={(e) => {
              onChange("categoryId", e.target.value || undefined);
              resetBelow("categoryId");
            }}
            className={selectClass}
          >
            <option value="">All Categories</option>
            {catData?.getCategories?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {levels.includes("assessment") && (
        <div className="flex flex-col gap-1.5">
          <Label>Assessment</Label>
          <select
            value={value.assessmentId ?? ""}
            onChange={(e) => {
              onChange("assessmentId", e.target.value || undefined);
              resetBelow("assessmentId");
            }}
            disabled={!value.categoryId}
            className={`${selectClass} ${!value.categoryId ? "opacity-50" : ""}`}
          >
            <option value="">
              {value.categoryId ? "All Assessments" : "Pick category"}
            </option>
            {assessData?.getAssessments?.items?.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {levels.includes("step") && (
        <div className="flex flex-col gap-1.5">
          <Label>Step</Label>
          <select
            value={value.stepId ?? ""}
            onChange={(e) => {
              onChange("stepId", e.target.value || undefined);
              resetBelow("stepId");
            }}
            disabled={!value.assessmentId}
            className={`${selectClass} ${
              !value.assessmentId ? "opacity-50" : ""
            }`}
          >
            <option value="">
              {value.assessmentId ? "All Steps" : "Pick assessment"}
            </option>
            {stepData?.getSteps?.items?.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.stepName}
              </option>
            ))}
          </select>
        </div>
      )}

      {levels.includes("condition") && (
        <div className="flex flex-col gap-1.5">
          <Label>Condition</Label>
          <select
            value={value.conditionId ?? ""}
            onChange={(e) =>
              onChange("conditionId", e.target.value || undefined)
            }
            disabled={!value.stepId}
            className={`${selectClass} ${!value.stepId ? "opacity-50" : ""}`}
          >
            <option value="">
              {value.stepId ? "All Conditions" : "Pick step"}
            </option>
            {condData?.getConditions?.items?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
