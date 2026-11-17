"use client";
import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { StepForm } from "../../components/StepForm";
import { GET_STEP_BY_ID } from "../../../../../../lib/graphql/queries/assessment.queries";
import { UPDATE_ASSESSMENT_STEP } from "../../../../../../lib/graphql/mutations/assessment.mutations";

export default function EditStepPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, loading: fetching } = useQuery<any>(GET_STEP_BY_ID, {
    variables: { id },
  });

  const [update, { loading }] = useMutation(UPDATE_ASSESSMENT_STEP, {
    onCompleted() {
      toast.success("Step updated successfully");
      router.push("/questionaries/steps");
    },
    onError(err) {
      toast.error(err.message);
      console.error("Error:", err);
    },
  });

  const step = data?.getStepById;
  if (fetching) return <div className="p-8">Loading...</div>;
  if (!step) return <div className="p-8">Not found</div>;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Edit ${step.stepName}`}
        breadcrumbs={[
          { label: "Questionaries" }, // 👈 Fixed breadcrumb
          { label: "Steps", href: "/questionaries/steps" },
          { label: "Edit" },
        ]}
      />
      <StepForm
        isEdit
        isLoading={loading}
        initialData={step}
        onSubmit={(formData) => {
          // 👇 ONLY pick the fields allowed in UpdateAssessmentStepInput
          update({
            variables: {
              input: {
                id,
                stepName: formData.stepName,
                stepCategory: formData.stepCategory,
                stepNumber: formData.stepNumber,
                title: formData.title || undefined,
                subtitle: formData.subtitle || undefined,
                description: formData.description || undefined,
                priority: formData.priority,
              },
            },
          });
        }}
      />
    </div>
  );
}
