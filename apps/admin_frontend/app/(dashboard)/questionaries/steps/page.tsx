"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react"; // 👈 Import useMutation
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui"; // 👈 Import ConfirmDialog
import { toast } from "sonner"; // 👈 Import toast
import { PageHeader } from "../../../../components/ui/PageHeader";
import { CascadeFilter } from "../../../../components/ui/CascadeFilter";
import { StepTable } from "./components/StepTable";
import { StepSkeleton } from "./components/StepSkeleton";
import { GET_STEPS } from "../../../../lib/graphql/queries/assessment.queries";
import { DELETE_ASSESSMENT_STEP } from "../../../../lib/graphql/mutations/assessment.mutations"; // 👈 Import mutation

export default function StepsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<{
    categoryId?: string;
    assessmentId?: string;
  }>({});
  const [deleteId, setDeleteId] = useState<string | null>(null); // 👈 State for dialog

  const { data, loading, refetch } = useQuery<any>(GET_STEPS, {
    variables: { assessmentId: filter.assessmentId },
    fetchPolicy: "cache-and-network",
  });

  // 👇 Setup delete mutation
  const [deleteStep, { loading: deleting }] = useMutation(
    DELETE_ASSESSMENT_STEP,
    {
      onCompleted() {
        toast.success("Step deleted successfully");
        setDeleteId(null);
        refetch(); // Refresh the list
      },
      onError(err) {
        toast.error(err.message);
      },
    },
  );

  const steps = data?.getSteps?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Steps"
        breadcrumbs={[{ label: "Questionaries" }, { label: "Steps" }]} // 👈 Fixed breadcrumb
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <CascadeFilter
            value={filter}
            onChange={(key, value) =>
              setFilter((prev) => ({ ...prev, [key]: value }))
            }
            levels={["category", "assessment"]}
          />
        </div>

        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">All Steps</h2>
            <p className="text-sm text-gray-500 mt-0.5">{steps.length} total</p>
          </div>
          <Button
            size="md"
            className="gap-2"
            disabled={!filter.assessmentId}
            onClick={() => router.push("/questionaries/steps/create")}
          >
            <Plus size={15} />
            Add Step
          </Button>
        </div>

        {loading && steps.length === 0 ? (
          <StepSkeleton />
        ) : (
          <StepTable
            data={steps}
            onEdit={(id) => router.push(`/questionaries/steps/edit/${id}`)}
            onDelete={(id) => setDeleteId(id)} // 👈 Pass delete handler
          />
        )}
      </div>

      {/* 👇 Add Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteStep({ variables: { id: deleteId } });
        }}
        title="Delete Step"
        description="Are you sure you want to delete this step? All conditions and options inside it will also be deleted. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
