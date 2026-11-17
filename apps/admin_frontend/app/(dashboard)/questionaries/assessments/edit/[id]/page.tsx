"use client";
import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { AssessmentForm } from "../../components/AssessmentForm";
import { GET_ASSESSMENT_BY_ID } from "../../../../../../lib/graphql/queries/assessment.queries";
import { UPDATE_ASSESSMENT } from "../../../../../../lib/graphql/mutations/assessment.mutations";

export default function EditAssessmentPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, loading: fetching } = useQuery<any>(GET_ASSESSMENT_BY_ID, {
    variables: { id },
  });

  const [update, { loading }] = useMutation(UPDATE_ASSESSMENT, {
    onCompleted() {
      router.push("/questionaries/assessments");
    },
    onError(err) {
      console.log("This is the error:", err);
    },
  });

  const assessment = data?.getAssessmentById;

  if (fetching) return <div className="p-8">Loading...</div>;
  if (!assessment) return <div className="p-8">Not found</div>;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Edit ${assessment.name}`}
        breadcrumbs={[
          { label: "Selling" },
          { label: "Assessments", href: "/questionaries/assessments" },
          { label: "Edit" },
        ]}
      />
      <AssessmentForm
        isEdit
        isLoading={loading}
        initialData={{
          id: assessment.id,
          name: assessment.name,
          description: assessment.description,
          categoryId: assessment.category?.id ?? "",
        }}
        onSubmit={(formData) =>
          update({
            variables: {
              input: {
                id,
                name: formData.name,
                description: formData.description,
              },
            },
          })
        }
      />
    </div>
  );
}
