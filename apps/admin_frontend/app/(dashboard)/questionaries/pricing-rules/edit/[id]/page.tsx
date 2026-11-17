"use client";
import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { PricingRuleForm } from "../../components/PricingRuleForm";
import { GET_CONDITION_RULE_BY_ID } from "../../../../../../lib/graphql/queries/pricingRule.queries";
import { UPDATE_CONDITION_RULE } from "../../../../../../lib/graphql/mutations/pricingRule.mutations";

export default function EditPricingRulePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, loading: fetching } = useQuery<any>(GET_CONDITION_RULE_BY_ID, {
    variables: { id },
  });

  const [update, { loading }] = useMutation(UPDATE_CONDITION_RULE, {
    onCompleted() {
      toast.success("Pricing rule updated");
      router.push("/questionaries/pricing-rules");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const rule = data?.getConditionRuleById;
  if (fetching) return <div className="p-8">Loading...</div>;
  if (!rule) return <div className="p-8">Not found</div>;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Edit ${rule.ruleName ?? "Rule"}`}
        breadcrumbs={[
          { label: "Selling" },
          { label: "Pricing Rules", href: "/questionaries/pricing-rules" },
          { label: "Edit" },
        ]}
      />
      <PricingRuleForm
        isEdit
        isLoading={loading}
        initialData={rule}
        onSubmit={(formData) =>
          update({ variables: { input: { id, ...formData } } })
        }
      />
    </div>
  );
}
