"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
  MARK_AS_SOLD,
} from "../../../lib/graphql/mutations/inventory.mutations";
import { useNavigate } from "../../../lib/hooks/useNavigate";

export default function InventoryPage() {
  const { navigate } = useNavigate();
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [soldProduct, setSoldProduct] = useState<InventoryProduct | null>(null);
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

  const handleSort = (field: string) => {
    setFilter((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }));
  };

  const handleFilterChange = (key: keyof InventoryFilter, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize, page: 1 }));
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
            onReset={() =>
              setFilter({
                page: 1,
                pageSize: 10,
                sortBy: "createdAt",
                sortOrder: "desc",
              })
            }
          />
        </div>

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
          />
        )}
      </div>

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
