"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { CascadeFilter } from "../../../../components/ui/CascadeFilter";
import { Pagination } from "../../../../components/table/Pagination";
import { ConditionTable } from "./components/ConditionTable";
import { ConditionSkeleton } from "./components/ConditionSkeleton";
import { GET_CONDITIONS } from "../../../../lib/graphql/queries/condition.queries";
import { DELETE_CONDITION } from "../../../../lib/graphql/mutations/condition.mutations";

export default function ConditionsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<any>({ page: 1, pageSize: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<any>(GET_CONDITIONS, {
    variables: { filter },
    fetchPolicy: "cache-and-network",
  });

  const [deleteCondition, { loading: deleting }] = useMutation(
    DELETE_CONDITION,
    {
      onCompleted() {
        toast.success("Condition deleted successfully");
        setDeleteId(null);

        // deleted the last row of a page -> go back one page
        if (conditions.length === 1 && filter.page > 1) {
          setFilter((p: any) => ({ ...p, page: p.page - 1 }));
        } else {
          refetch();
        }
      },
      onError(err) {
        toast.error(err.message);
      },
    },
  );

  const conditions = data?.getConditions?.items ?? [];
  const total = data?.getConditions?.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Conditions"
        breadcrumbs={[{ label: "Questionaries" }, { label: "Conditions" }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <CascadeFilter
            value={filter}
            onChange={(key, value) =>
              setFilter((p: any) => ({ ...p, [key]: value, page: 1 }))
            }
            levels={["category", "assessment", "step"]}
          />
        </div>

        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Conditions
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {total} total conditions
            </p>
          </div>
          <Button
            size="md"
            className="gap-2"
            disabled={!filter.stepId}
            onClick={() => router.push("/questionaries/conditions/create")}
          >
            <Plus size={15} />
            Add Condition
          </Button>
        </div>

        {loading && conditions.length === 0 ? (
          <ConditionSkeleton />
        ) : (
          <ConditionTable
            data={conditions}
            onEdit={(id) => router.push(`/questionaries/conditions/edit/${id}`)}
            onDelete={(id) => setDeleteId(id)}
            onManageOptions={(id) =>
              router.push(`/questionaries/options?conditionId=${id}`)
            }
          />
        )}

        {total > 0 && (
          <Pagination
            currentPage={filter.page}
            totalItems={total}
            pageSize={filter.pageSize}
            onPageChange={(page) => setFilter((p: any) => ({ ...p, page }))}
            onPageSizeChange={(pageSize) =>
              setFilter((p: any) => ({ ...p, pageSize, page: 1 }))
            }
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteCondition({ variables: { id: deleteId } });
        }}
        title="Delete Condition"
        description="Are you sure you want to delete this condition? All options inside it will also be deleted. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
