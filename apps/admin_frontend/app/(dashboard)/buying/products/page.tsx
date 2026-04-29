"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { BuyingProductTable } from "./components/BuyingProductTable";
import { BuyingProductSkeleton } from "./components/BuyingProductSkeleton";
import { BuyingProductFilterBar } from "./components/BuyingProductFilterBar";
import {
  BuyingProduct,
  BuyingProductFilter,
  BuyingProductsResponse,
} from "./types";
import { GET_BUYING_PRODUCTS } from "../../../../lib/graphql/queries/buyingProduct.queries";
import { DELETE_BUYING_PRODUCT } from "../../../../lib/graphql/mutations/buyingProduct.mutations";

export default function BuyingProductsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<BuyingProductFilter>({
    page: 1,
    pageSize: 10,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [products, setProducts] = useState<BuyingProduct[]>([]);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const { data, loading } = useQuery<{
    getBuyingProducts: BuyingProductsResponse;
  }>(GET_BUYING_PRODUCTS, {
    variables: { filter },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.getBuyingProducts) {
      setProducts(data.getBuyingProducts.items);
      setPaginationMeta({
        total: data.getBuyingProducts.total,
        page: data.getBuyingProducts.page,
        pageSize: data.getBuyingProducts.pageSize,
        totalPages: data.getBuyingProducts.totalPages,
      });
    }
  }, [data]);

  const [deleteProduct, { loading: deleting }] = useMutation<{
    deleteBuyingProduct: { id: string; message: string };
  }>(DELETE_BUYING_PRODUCT, {
    onCompleted(res) {
      toast.success("Product deleted successfully");
      setProducts((prev) =>
        prev.filter((p) => p.id !== res.deleteBuyingProduct.id),
      );
      setPaginationMeta((prev) => ({ ...prev, total: prev.total - 1 }));
      setDeleteId(null);
    },
  });

  const handleFilterChange = (key: keyof BuyingProductFilter, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleReset = () => {
    setFilter({ page: 1, pageSize: filter.pageSize ?? 10 });
  };

  return (
    <div>
      <PageHeader
        title="Buying Products"
        breadcrumbs={[{ label: "Buying" }, { label: "All Products" }]}
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
            onClick={() => router.push("/buying/products/create")}
          >
            <Plus size={15} />
            Add Product
          </Button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <BuyingProductFilterBar
            filter={filter}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {loading && products.length === 0 ? (
          <BuyingProductSkeleton />
        ) : (
          <BuyingProductTable
            data={products}
            total={paginationMeta.total}
            currentPage={filter.page ?? 1}
            pageSize={filter.pageSize ?? 10}
            totalPages={paginationMeta.totalPages}
            onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) =>
              setFilter((prev) => ({ ...prev, pageSize, page: 1 }))
            }
            onEdit={(id) => router.push(`/buying/products/edit/${id}`)}
            onDelete={(id) => setDeleteId(id)}
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
