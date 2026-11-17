"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { StepForm } from "../components/StepForm";
import { CREATE_ASSESSMENT_STEP } from "../../../../../lib/graphql/mutations/assessment.mutations";

export default function CreateStepPage() {
  const router = useRouter();
  const [create, { loading }] = useMutation(CREATE_ASSESSMENT_STEP, {
    onCompleted() {
      router.push("/questionaries/steps");
    },
    onError(err) {
      console.error("This is the error while createing step:", err);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Add Step"
        breadcrumbs={[
          { label: "Selling" },
          { label: "Steps", href: "/selling/steps" },
          { label: "Add" },
        ]}
      />
      <StepForm
        isLoading={loading}
        onSubmit={(data) => create({ variables: { input: data } })}
      />
    </div>
  );
}
