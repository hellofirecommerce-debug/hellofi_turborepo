"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { PricingRuleForm } from "../components/PricingRuleForm";
import { CREATE_CONDITION_RULE } from "../../../../../lib/graphql/mutations/pricingRule.mutations";

export default function CreatePricingRulePage() {
  const router = useRouter();
  const [create, { loading }] = useMutation(CREATE_CONDITION_RULE, {
    onCompleted() {
      toast.success("Pricing rule created");
      router.push("/questionaries/pricing-rules");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Add Pricing Rule"
        breadcrumbs={[
          { label: "Selling" },
          { label: "Pricing Rules", href: "/questionaries/pricing-rules" },
          { label: "Add" },
        ]}
      />
      <PricingRuleForm
        isLoading={loading}
        onSubmit={(data) => create({ variables: { input: data } })}
      />
    </div>
  );
}
