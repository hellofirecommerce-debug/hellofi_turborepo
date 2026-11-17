"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { PricingRuleTable } from "./components/PricingRuleTable";
import { GET_CONDITION_RULES } from "../../../../lib/graphql/queries/pricingRule.queries";

export default function PricingRulesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<any>({ page: 1, pageSize: 20 });

  const { data, loading } = useQuery<any>(GET_CONDITION_RULES, {
    variables: { filter },
    fetchPolicy: "cache-and-network",
  });

  const items = data?.getConditionRules?.items ?? [];
  const total = data?.getConditionRules?.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Pricing Rules"
        breadcrumbs={[{ label: "Selling" }, { label: "Pricing Rules" }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Pricing Rules
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{total} total rules</p>
          </div>
          <Button
            size="md"
            className="gap-2"
            onClick={() => router.push("/questionaries/pricing-rules/create")}
          >
            <Plus size={15} />
            Add Rule
          </Button>
        </div>

        <PricingRuleTable
          data={items}
          loading={loading}
          onEdit={(id) =>
            router.push(`/questionaries/pricing-rules/edit/${id}`)
          }
        />
      </div>
    </div>
  );
}
