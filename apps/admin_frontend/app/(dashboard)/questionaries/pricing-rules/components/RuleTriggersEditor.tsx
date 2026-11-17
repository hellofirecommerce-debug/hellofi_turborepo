"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Label } from "@repo/ui";
import { useQuery } from "@apollo/client/react";
import { GET_CONDITIONS } from "../../../../../lib/graphql/queries/condition.queries";

interface Trigger {
  conditionId: string;
  optionId: string;
  logic: string;
}

interface Props {
  triggers: Trigger[];
  onChange: (triggers: Trigger[]) => void;
}

export const RuleTriggersEditor: React.FC<Props> = ({ triggers, onChange }) => {
  const { data } = useQuery<any>(GET_CONDITIONS, {
    variables: { filter: { pageSize: 500 } },
  });
  const conditions = data?.getConditions?.items ?? [];

  const addTrigger = () =>
    onChange([...triggers, { conditionId: "", optionId: "", logic: "OR" }]);

  const update = (i: number, key: string, value: string) => {
    onChange(
      triggers.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)),
    );
  };

  const remove = (i: number) =>
    onChange(triggers.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>When these conditions are true → trigger the rule</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={addTrigger}
          className="gap-1.5"
        >
          <Plus size={14} />
          Add Trigger
        </Button>
      </div>

      {triggers.map((t, i) => {
        const selected = conditions.find((c: any) => c.id === t.conditionId);
        return (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_100px_40px] gap-3 items-end border border-gray-200 rounded-lg p-3"
          >
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Condition</Label>
              <select
                value={t.conditionId}
                onChange={(e) => {
                  update(i, "conditionId", e.target.value);
                  update(i, "optionId", "");
                }}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                {conditions.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Option</Label>
              <select
                value={t.optionId}
                onChange={(e) => update(i, "optionId", e.target.value)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                {selected?.options?.map((o: any) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Logic</Label>
              <select
                value={t.logic}
                onChange={(e) => update(i, "logic", e.target.value)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md"
              >
                <option value="OR">OR</option>
                <option value="AND">AND</option>
              </select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              className="h-9 w-9 text-red-400 hover:text-red-600"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
