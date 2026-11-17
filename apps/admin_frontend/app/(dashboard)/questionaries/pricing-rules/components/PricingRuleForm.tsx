"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Input, Label, Button } from "@repo/ui";
import { GET_CONDITIONS } from "../../../../../lib/graphql/queries/condition.queries";
import { RuleTriggersEditor } from "./RuleTriggersEditor";

const selectClass =
  "w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-[3px] focus:border-[rgb(33,76,123)] focus:ring-[rgb(33,76,123)]/25";

const RULE_LOGIC = [
  "SKIP_ALL_OPTIONS",
  "APPLY_ONLY_SPECIFIC_OPTIONS",
  "SKIP_SELF",
  "APPLY_HIGHEST_PERCENTAGE",
];

interface Props {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const PricingRuleForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isLoading,
  isEdit,
}) => {
  const [form, setForm] = useState({
    conditionId: initialData?.conditionId ?? "",
    ruleName: initialData?.ruleName ?? "",
    description: initialData?.description ?? "",
    ruleLogic: initialData?.ruleLogic ?? "SKIP_ALL_OPTIONS",
    ruleBrandStrategy: initialData?.ruleBrandStrategy ?? "ALL",
    targetConditionId: initialData?.targetConditionId ?? "",
    highestScoreType: initialData?.highestScoreType ?? "PER",
    highestAction: initialData?.highestAction ?? "DECREMENT",
    targetOptionId: initialData?.targetOptionId ?? "",
  });

  const [triggers, setTriggers] = useState<any[]>(initialData?.triggers ?? []);

  const { data: condData } = useQuery<any>(GET_CONDITIONS, {
    variables: { filter: { pageSize: 500 } },
  });
  const conditions = condData?.getConditions?.items ?? [];

  useEffect(() => {
    if (initialData) {
      setForm((p) => ({ ...p, ...initialData }));
      if (initialData.triggers) setTriggers(initialData.triggers);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!form.conditionId) return;
    onSubmit({ ...form, triggers });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>
          Applies To Condition <span className="text-red-500">*</span>
        </Label>
        <select
          value={form.conditionId}
          onChange={(e) =>
            setForm((p) => ({ ...p, conditionId: e.target.value }))
          }
          disabled={isEdit}
          className={`${selectClass} ${isEdit ? "opacity-60" : ""}`}
        >
          <option value="">Select condition</option>
          {conditions.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Rule Name</Label>
          <Input
            placeholder="e.g. No Bill Rule"
            value={form.ruleName}
            onChange={(e) =>
              setForm((p) => ({ ...p, ruleName: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>
            Rule Logic <span className="text-red-500">*</span>
          </Label>
          <select
            value={form.ruleLogic}
            onChange={(e) =>
              setForm((p) => ({ ...p, ruleLogic: e.target.value }))
            }
            className={selectClass}
          >
            {RULE_LOGIC.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />
        </div>
      </div>

      <RuleTriggersEditor triggers={triggers} onChange={setTriggers} />

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button size="md" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
        </Button>
      </div>
    </div>
  );
};
