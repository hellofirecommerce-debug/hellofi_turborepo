"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { AssessmentForm } from "../components/AssessmentForm";
import { CREATE_ASSESSMENT } from "../../../../../lib/graphql/mutations/assessment.mutations";

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [create, { loading }] = useMutation(CREATE_ASSESSMENT, {
    onCompleted() {
      router.push("/questionaries/assessments");
    },
    onError(err) {
      console.log("this is the error:", err);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Add Assessment"
        breadcrumbs={[
          { label: "Selling" },
          { label: "Assessments", href: "/questionaries/assessments" },
          { label: "Add" },
        ]}
      />
      <AssessmentForm
        isLoading={loading}
        onSubmit={(data) => create({ variables: { input: data } })}
      />
    </div>
  );
}
