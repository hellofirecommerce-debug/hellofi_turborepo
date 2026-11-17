"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react"; // 👈 Import useMutation
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner"; // 👈 Import toast
import { PageHeader } from "../../../../components/ui/PageHeader";
import { AssessmentTable } from "./components/AssessmentTable";
import { AssessmentSkeleton } from "./components/AssessmentSkeleton";
import { CascadeFilter } from "../../../../components/ui/CascadeFilter";
import { GET_ASSESSMENTS } from "../../../../lib/graphql/queries/assessment.queries";
import { DELETE_ASSESSMENT } from "../../../../lib/graphql/mutations/assessment.mutations"; // 👈 Import mutation

export default function AssessmentsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<{ categoryId?: string }>({});
  const [deleteId, setDeleteId] = useState<string | null>(null); // 👈 State for dialog

  const { data, loading, refetch } = useQuery<any>(GET_ASSESSMENTS, {
    variables: { categoryId: filter.categoryId },
    fetchPolicy: "cache-and-network",
  });

  // 👇 Setup delete mutation
  const [deleteAssessment, { loading: deleting }] = useMutation(
    DELETE_ASSESSMENT,
    {
      onCompleted() {
        toast.success("Assessment deleted successfully");
        setDeleteId(null);
        refetch(); // Refresh the list
      },
      onError(err) {
        toast.error(err.message);
      },
    },
  );

  const assessments = data?.getAssessments?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Assessments"
        breadcrumbs={[{ label: "Questionaries" }, { label: "Assessments" }]} // 👈 Fixed breadcrumb
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <CascadeFilter
            value={filter}
            onChange={(key, value) =>
              setFilter((prev) => ({ ...prev, [key]: value }))
            }
            levels={["category"]}
          />
        </div>

        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Assessments
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {assessments.length} total
            </p>
          </div>
          <Button
            size="md"
            className="gap-2"
            onClick={() => router.push("/questionaries/assessments/create")}
          >
            <Plus size={15} />
            Add Assessment
          </Button>
        </div>

        {loading && assessments.length === 0 ? (
          <AssessmentSkeleton />
        ) : (
          <AssessmentTable
            data={assessments}
            onEdit={(id) =>
              router.push(`/questionaries/assessments/edit/${id}`)
            }
            onDelete={(id) => setDeleteId(id)} // 👈 Pass delete handler
          />
        )}
      </div>

      {/* 👇 Add Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteAssessment({ variables: { id: deleteId } });
        }}
        title="Delete Assessment"
        description="Are you sure you want to delete this assessment? All steps, conditions, and options inside it will also be deleted. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
