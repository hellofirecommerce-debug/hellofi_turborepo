"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { ConditionForm } from "../components/ConditionForm";
import { CREATE_CONDITION } from "../../../../../lib/graphql/mutations/condition.mutations";

export default function CreateConditionPage() {
  const router = useRouter();

  const [create, { loading }] = useMutation(CREATE_CONDITION, {
    onCompleted() {
      toast.success("Condition created");
      router.push("/questionaries/conditions");
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  // 👇 Accept image from form and pass in variables
  const handleSubmit = (data: any, image: File | null) => {
    create({ variables: { input: data, image } });
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Add Condition"
        breadcrumbs={[
          { label: "Questionaries" },
          { label: "Conditions", href: "/questionaries/conditions" },
          { label: "Add" },
        ]}
      />
      <ConditionForm isLoading={loading} onSubmit={handleSubmit} />
    </div>
  );
}
