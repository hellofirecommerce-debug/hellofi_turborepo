"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus, Trash2, X } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { PageHeader } from "../../../components/ui/PageHeader";
import { InventoryTable } from "./components/InventoryTable";
import { InventorySkeleton } from "./components/InventorySkeleton";
import { InventoryFilterBar } from "./components/InventoryFilterBar";
import { MarkAsSoldModal } from "./components/MarkAsSoldModal";
import {
  InventoryProduct,
  InventoryFilter,
  InventoryProductsResponse,
} from "./types";
import { GET_INVENTORY_PRODUCTS } from "../../../lib/graphql/queries/inventory.queries";
import {
  DELETE_INVENTORY_PRODUCT,
  DELETE_INVENTORY_PRODUCTS,
  MARK_AS_SOLD,
} from "../../../lib/graphql/mutations/inventory.mutations";
import { useNavigate } from "../../../lib/hooks/useNavigate";

export default function InventoryPage() {
  const { navigate } = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [soldProduct, setSoldProduct] = useState<InventoryProduct | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [filter, setFilter] = useState<InventoryFilter>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, loading, refetch } = useQuery<{
    getInventoryProducts: InventoryProductsResponse;
  }>(GET_INVENTORY_PRODUCTS, {
    variables: { filter },
    fetchPolicy: "cache-and-network",
  });

  const [deleteProduct, { loading: deleting }] = useMutation(
    DELETE_INVENTORY_PRODUCT,
    {
      onCompleted() {
        toast.success("Product deleted");
        setDeleteId(null);
        refetch();
      },
    },
  );

  const [deleteProducts, { loading: bulkDeleting }] = useMutation<{
    deleteInventoryProducts: {
      deletedCount: number;
      skippedCount: number;
      message: string;
      skipped: { id: string; orderId: string | null; reason: string }[];
    };
  }>(DELETE_INVENTORY_PRODUCTS, {
    onCompleted(result) {
      const res = result.deleteInventoryProducts;
      if (res.deletedCount > 0) {
        toast.success(`${res.deletedCount} product(s) deleted`);
      }
      if (res.skippedCount > 0) {
        const first = res.skipped[0];
        toast.error(
          `${res.skippedCount} skipped${first ? ` — ${first.orderId ?? first.id}: ${first.reason}` : ""}`,
        );
      }
      setBulkDeleteOpen(false);
      setSelectedIds([]);
      refetch();
    },
  });

  const [markAsSold, { loading: marking }] = useMutation(MARK_AS_SOLD, {
    onCompleted() {
      toast.success("Product marked as sold");
      setSoldProduct(null);
      refetch();
    },
  });

  const response = data?.getInventoryProducts;
  const products: InventoryProduct[] = response?.items ?? [];

  const sortConfig = {
    field: filter.sortBy ?? "createdAt",
    order: (filter.sortOrder ?? "desc") as "asc" | "desc",
  };

  // selection is cleared whenever the visible list changes
  const clearSelection = () => setSelectedIds([]);

  const handleSort = (field: string) => {
    clearSelection();
    setFilter((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }));
  };

  const handleFilterChange = (key: keyof InventoryFilter, value: any) => {
    clearSelection();
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    clearSelection();
    setFilter((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    clearSelection();
    setFilter((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // select / unselect every product on the current page
  const handleToggleAll = (checked: boolean) => {
    setSelectedIds(checked ? products.map((p) => p.id) : []);
  };

  const handleMarkAsSold = async (formData: any) => {
    if (!soldProduct) return;
    await markAsSold({
      variables: {
        input: {
          id: soldProduct.id,
          sellingDate: formData.sellingDate
            ? new Date(formData.sellingDate).toISOString()
            : undefined,
          sellingPrice: Number(formData.sellingPrice),
          invoiceNumber: formData.invoiceNumber,
          sellingCustomerName: formData.sellingCustomerName,
          sellingCustomerEmail: formData.sellingCustomerEmail || undefined,
          sellingCustomerPhone: formData.sellingCustomerPhone,
          sellingCustomerAddress: formData.sellingCustomerAddress,
          paymentMode: formData.paymentMode,
          receivedInBank: Number(formData.receivedInBank),
          sellingOtherCharges: Number(formData.sellingOtherCharges || 0),
          splitPaymentDetails: formData.splitPaymentDetails || undefined,
        },
      },
    });
  };

  return (
    <div>
      <PageHeader title="Inventory" breadcrumbs={[{ label: "Inventory" }]} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Products
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {response?.total ?? 0} total products
            </p>
          </div>
          <Button
            size="md"
            className="gap-2 shrink-0"
            onClick={() => navigate("/inventory/add")}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100">
          <InventoryFilterBar
            filter={filter}
            onChange={handleFilterChange}
            onReset={() => {
              clearSelection();
              setFilter({
                page: 1,
                pageSize: 10,
                sortBy: "createdAt",
                sortOrder: "desc",
              });
            }}
          />
        </div>

        {/* Bulk action bar — visible only when something is selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-5 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-sm font-medium text-[rgb(33,76,123)]">
              {selectedIds.length} selected
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                className="gap-1.5"
                onClick={clearSelection}
                disabled={bulkDeleting}
              >
                <X size={14} />
                Clear
              </Button>
              <Button
                size="md"
                className="gap-1.5 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setBulkDeleteOpen(true)}
                disabled={bulkDeleting}
              >
                <Trash2 size={14} />
                Delete selected
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        {loading && products.length === 0 ? (
          <InventorySkeleton />
        ) : (
          <InventoryTable
            data={products}
            total={response?.total ?? 0}
            currentPage={filter.page ?? 1}
            pageSize={filter.pageSize ?? 10}
            totalPages={response?.totalPages ?? 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={(id) => navigate(`/inventory/edit/${id}`)}
            onDelete={(id) => setDeleteId(id)}
            onMarkAsSold={(product) => setSoldProduct(product)}
            sortConfig={sortConfig}
            onSort={handleSort}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleAll={handleToggleAll}
          />
        )}
      </div>

      {/* single delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteProduct({ variables: { id: deleteId } });
        }}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />

      {/* bulk delete */}
      <ConfirmDialog
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={async () => {
          if (selectedIds.length === 0) return;
          await deleteProducts({ variables: { ids: selectedIds } });
        }}
        title="Delete Selected Products"
        description={`Are you sure you want to delete ${selectedIds.length} selected product(s)? Products linked to an active invoice will be skipped.`}
        confirmLabel={`Delete ${selectedIds.length}`}
        isLoading={bulkDeleting}
      />

      <MarkAsSoldModal
        isOpen={!!soldProduct}
        onClose={() => setSoldProduct(null)}
        onSubmit={handleMarkAsSold}
        isLoading={marking}
        product={soldProduct}
      />
    </div>
  );
}
