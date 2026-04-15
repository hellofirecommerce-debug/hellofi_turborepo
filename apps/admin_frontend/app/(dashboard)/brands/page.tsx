"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { PageHeader } from "../../../components/ui/PageHeader";
import { BrandsTable } from "./BrandsTable";
import { BrandsSkeleton } from "./BrandSkeleton";
import { AddBrandModal } from "./AddBrandModal";
import { Brand, CategoryOption } from "./types";
import { GET_BRANDS } from "../../../lib/graphql/queries/brand.queries";
import { GET_CATEGORIES } from "../../../lib/graphql/queries/category.queries";
import {
  CREATE_BRAND,
  UPDATE_BRAND,
  DELETE_BRAND,
} from "../../../lib/graphql/mutations/brand.mutations";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { loading, data: brandsData } = useQuery<{ getBrands: Brand[] }>(
    GET_BRANDS,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const { data: categoriesData } = useQuery<{
    getCategories: CategoryOption[];
  }>(GET_CATEGORIES, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (brandsData?.getBrands) {
      setBrands(brandsData.getBrands as Brand[]);
    }
  }, [brandsData]);
  const handleEdit = (brand: Brand) => {
    setEditBrand(brand);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditBrand(null);
  };

  const [createBrand, { loading: creating }] = useMutation<{
    createBrand: Brand;
  }>(CREATE_BRAND, {
    onCompleted(data) {
      console.log("createBrand onCompleted:", data);
      setBrands((prev) => [data.createBrand, ...prev]);
      toast.success("Brand created successfully");
      setShowAddModal(false);
    },
  });

  const [updateBrand, { loading: updating }] = useMutation<{
    updateBrand: Brand;
  }>(UPDATE_BRAND, {
    onCompleted(data) {
      setBrands((prev) =>
        prev.map((b) => (b.id === data.updateBrand.id ? data.updateBrand : b)),
      );
      toast.success("Brand updated successfully");
      handleModalClose();
    },
  });

  const [deleteBrand, { loading: deleting }] = useMutation<{
    deleteBrand: { id: string };
  }>(DELETE_BRAND, {
    onCompleted() {
      setBrands((prev) => prev.filter((b) => b.id !== deleteId));
      toast.success("Brand deleted successfully");
      setDeleteId(null);
    },
  });

  useEffect(() => {
    if (categoriesData?.getCategories) {
      setCategories(categoriesData.getCategories as CategoryOption[]);
    }
  }, [categoriesData]);
  const handleAdd = async (formData: any) => {
    await createBrand({
      variables: {
        input: {
          name: formData.name,
          seoName: formData.seoName,
          brandCategories: formData.brandCategories,
        },
        image: formData.image,
      },
    });
  };

  const handleUpdate = async (formData: any) => {
    await updateBrand({
      variables: {
        updateBrandId: editBrand?.id,
        input: {
          name: formData.name,
          seoName: formData.seoName,
          brandCategories: formData.brandCategories,
        },
        ...(formData.image && { image: formData.image }),
      },
    });
  };

  return (
    <div>
      <PageHeader title="Brands" breadcrumbs={[{ label: "Brands" }]} />

      {loading ? (
        <BrandsSkeleton />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Brands List
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {brands.length} total brands · Logo size: 100×100px
              </p>
            </div>
            <Button
              size="md"
              className="gap-2 w-full sm:w-auto"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={15} />
              Add Brand
            </Button>
          </div>

          <BrandsTable
            data={brands}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>
      )}

      <AddBrandModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        onSubmit={editBrand ? handleUpdate : handleAdd}
        isLoading={creating || updating}
        editData={editBrand}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteBrand({ variables: { id: deleteId } });
        }}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
