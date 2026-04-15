"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus } from "lucide-react";
import { Button, ConfirmDialog } from "@repo/ui";
import { toast } from "sonner";
import { PageHeader } from "../../../components/ui/PageHeader";
import { CategoriesTable } from "./CategoriesTable";
import { CategoriesSkeleton } from "./CategoriesSkeleton";
import { AddCategoryModal } from "./AddCategoryModal";
import { Category } from "./types";
import { GET_CATEGORIES } from "../../../lib/graphql/queries/category.queries";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEOGRY,
} from "../../../lib/graphql/mutations/category.mutations";

export default function CategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditCategory(null);
  };

  const { loading, data } = useQuery<{ getCategories: Category[] }>(
    GET_CATEGORIES,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  useEffect(() => {
    if (data?.getCategories) {
      setCategories(data.getCategories as Category[]);
    }
  }, [data]);

  const [createCategory, { loading: creating }] = useMutation<{
    createCategory: Category;
  }>(CREATE_CATEGORY, {
    onCompleted(data) {
      setCategories((prev) => [data.createCategory, ...prev]);
      toast.success("Category created successfully");
      setShowAddModal(false);
    },
  });

  const [updateCategory, { loading: updating }] = useMutation<{
    updateCategory: Category;
  }>(UPDATE_CATEGORY, {
    onCompleted(data) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === data.updateCategory.id ? data.updateCategory : c,
        ),
      );
      toast.success("Category updated successfully");
      handleModalClose();
    },
  });

  const [deleteCategory, { loading: deleting }] = useMutation<{
    deleteCategory: { id: string };
  }>(DELETE_CATEOGRY, {
    onCompleted() {
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Category deleted successfully");
      setDeleteId(null);
    },
  });

  const handleAdd = async (formData: any) => {
    await createCategory({
      variables: {
        input: {
          name: formData.name,
          seoName: formData.seoName,
          categoryType: formData.categoryType,
          priority: Number(formData.priority),
        },
        image: formData.image,
      },
    });
  };

  const handleUpdate = async (formData: any) => {
    await updateCategory({
      variables: {
        updateCategoryId: editCategory?.id,
        input: {
          name: formData.name,
          seoName: formData.seoName,
          categoryType: formData.categoryType,
          priority: Number(formData.priority),
        },
        ...(formData.image && { image: formData.image }),
      },
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteCategory({ variables: { id: deleteId } });
  };

  return (
    <div>
      <PageHeader title="Categories" breadcrumbs={[{ label: "Categories" }]} />

      {loading ? (
        <CategoriesSkeleton />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Categories List
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {categories.length} total categories · Image size: 100×100px
              </p>
            </div>
            <Button
              size="md"
              className="gap-2 w-full sm:w-auto"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={15} />
              Add Category
            </Button>
          </div>

          <CategoriesTable
            data={categories}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>
      )}

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        onSubmit={editCategory ? handleUpdate : handleAdd}
        isLoading={creating || updating}
        editData={editCategory}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
