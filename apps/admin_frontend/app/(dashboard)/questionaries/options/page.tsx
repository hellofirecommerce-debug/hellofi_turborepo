"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { CascadeFilter } from "../../../../components/ui/CascadeFilter";
import { OptionTable } from "./components/OptionTable";
import { OptionSkeleton } from "./components/OptionSkeleton";
import { GET_OPTIONS } from "../../../../lib/graphql/queries/option.queries";
import { DELETE_OPTION } from "../../../../lib/graphql/mutations/option.mutations";

export default function OptionsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<any>({ page: 1, pageSize: 20 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery<any>(GET_OPTIONS, {
    variables: { filter },
    fetchPolicy: "cache-and-network",
  });

  const [deleteOption, { loading: deleting }] = useMutation(DELETE_OPTION, {
    onCompleted() {
      toast.success("Option deleted successfully");
      setDeleteId(null);
      refetch();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const options = data?.getOptions?.items ?? [];
  const total = data?.getOptions?.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Options"
        breadcrumbs={[{ label: "Questionaries" }, { label: "Options" }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <CascadeFilter
            value={filter}
            onChange={(key, value) =>
              setFilter((p: any) => ({ ...p, [key]: value, page: 1 }))
            }
            levels={["category", "assessment", "step", "condition"]}
          />
        </div>

        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Options
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {total} total options
            </p>
          </div>
          <Button
            size="md"
            className="gap-2"
            disabled={!filter.conditionId}
            onClick={() =>
              router.push(
                `/questionaries/options/create?conditionId=${filter.conditionId}`,
              )
            }
          >
            <Plus size={15} />
            Add Option
          </Button>
        </div>

        {loading && options.length === 0 ? (
          <OptionSkeleton />
        ) : (
          <OptionTable
            data={options}
            total={total}
            currentPage={filter.page}
            pageSize={filter.pageSize}
            onPageChange={(page) => setFilter((p: any) => ({ ...p, page }))}
            onPageSizeChange={(pageSize) =>
              setFilter((p: any) => ({ ...p, pageSize, page: 1 }))
            }
            onEdit={(id) => router.push(`/questionaries/options/edit/${id}`)}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteOption({ variables: { id: deleteId } });
        }}
        title="Delete Option"
        description="Are you sure you want to delete this option? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
