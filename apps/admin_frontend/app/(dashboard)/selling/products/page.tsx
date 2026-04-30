"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { SellingProductTable } from "./components/SellingProductTable";
import { SellingProductSkeleton } from "./components/SellingProductSkeleton";
import { SellingProductFilterBar } from "./components/SellingProductFilterBar";
import {
  SellingProduct,
  SellingProductFilter,
  SellingProductsResponse,
} from "./types";
import { GET_SELLING_PRODUCTS } from "../../../../lib/graphql/queries/sellingProduct.queries";
import { DELETE_SELLING_PRODUCT } from "../../../../lib/graphql/mutations/sellingProduct.mutations";

export default function SellingProductsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<SellingProductFilter>({
    page: 1,
    pageSize: 10,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [products, setProducts] = useState<SellingProduct[]>([]);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const { data, loading } = useQuery<{
    getSellingProducts: SellingProductsResponse;
  }>(GET_SELLING_PRODUCTS, {
    variables: { filter },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.getSellingProducts) {
      setProducts(data.getSellingProducts.items);
      setPaginationMeta({
        total: data.getSellingProducts.total,
        page: data.getSellingProducts.page,
        pageSize: data.getSellingProducts.pageSize,
        totalPages: data.getSellingProducts.totalPages,
      });
    }
  }, [data]);

  const [deleteProduct, { loading: deleting }] = useMutation<{
    deleteSellingProduct: { id: string; message: string };
  }>(DELETE_SELLING_PRODUCT, {
    onCompleted(res) {
      toast.success("Product deleted successfully");
      setProducts((prev) =>
        prev.filter((p) => p.id !== res.deleteSellingProduct.id),
      );
      setPaginationMeta((prev) => ({ ...prev, total: prev.total - 1 }));
      setDeleteId(null);
    },
  });

  const handleFilterChange = (key: keyof SellingProductFilter, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleReset = () => {
    setFilter({ page: 1, pageSize: filter.pageSize ?? 10 });
  };

  return (
    <div>
      <PageHeader
        title="Selling Products"
        breadcrumbs={[{ label: "Selling" }, { label: "All Products" }]}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Products
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {paginationMeta.total} total products
            </p>
          </div>
          <Button
            size="md"
            className="gap-2 w-full sm:w-auto"
            onClick={() => router.push("/selling/products/create")}
          >
            <Plus size={15} />
            Add Product
          </Button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <SellingProductFilterBar
            filter={filter}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {loading && products.length === 0 ? (
          <SellingProductSkeleton />
        ) : (
          <SellingProductTable
            data={products}
            total={paginationMeta.total}
            currentPage={filter.page ?? 1}
            pageSize={filter.pageSize ?? 10}
            totalPages={paginationMeta.totalPages}
            onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) =>
              setFilter((prev) => ({ ...prev, pageSize, page: 1 }))
            }
            onEdit={(id) => router.push(`/selling/products/edit/${id}`)}
            onDelete={(id) => setDeleteId(id)}
            loading={loading}
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
    </div>
  );
}
