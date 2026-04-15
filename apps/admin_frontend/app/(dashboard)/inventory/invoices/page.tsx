"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { InvoiceTable } from "./components/InvoiceTable";
import { InvoiceSkeleton } from "./components/InvoiceSkeleton";
import { GET_INVOICES } from "../../../../lib/graphql/queries/invoice.queries";
import {
  CANCEL_INVOICE,
  FINALIZE_INVOICE,
} from "../../../../lib/graphql/mutations/invoice.mutations";
import { GetInvoicesResponse, InvoiceType } from "./types";

export default function AllInvoicesPage() {
  const router = useRouter();
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, loading, refetch } = useQuery<GetInvoicesResponse>(
    GET_INVOICES,
    {
      variables: { filter },
      fetchPolicy: "cache-and-network",
    },
  );

  const [cancelInvoice, { loading: cancelling }] = useMutation(CANCEL_INVOICE, {
    onCompleted: () => {
      toast.success("Invoice cancelled");
      setCancelId(null);
      refetch();
    },
  });

  const [finalizeInvoice] = useMutation(FINALIZE_INVOICE, {
    onCompleted: () => {
      toast.success("Invoice finalized");
      refetch();
    },
  });

  const response = data?.getInvoices;
  const invoices: InvoiceType[] = response?.items ?? [];

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  return (
    <div>
      <PageHeader
        title="All Invoices"
        breadcrumbs={[{ label: "Inventory" }, { label: "All Invoices" }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Invoices
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {response?.total ?? 0} total invoices
            </p>
          </div>
          <Button
            size="md"
            className="gap-2 shrink-0"
            onClick={() => router.push("/inventory/invoices/create")}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Create Invoice</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>

        {/* Table */}
        {loading && invoices.length === 0 ? (
          <InvoiceSkeleton />
        ) : (
          <InvoiceTable
            data={invoices}
            total={response?.total ?? 0}
            currentPage={filter.page}
            pageSize={filter.pageSize}
            totalPages={response?.totalPages ?? 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={(id) => router.push(`/inventory/invoices/${id}/edit`)}
            onCancel={(id) => setCancelId(id)}
            onFinalize={(id) => finalizeInvoice({ variables: { id } })}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={async () => {
          if (!cancelId) return;
          await cancelInvoice({ variables: { id: cancelId } });
        }}
        title="Cancel Invoice"
        description="Are you sure you want to cancel this invoice? This action cannot be undone."
        confirmLabel="Cancel Invoice"
        isLoading={cancelling}
      />
    </div>
  );
}
