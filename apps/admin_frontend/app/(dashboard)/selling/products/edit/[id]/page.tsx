"use client";
import React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { SellingProductForm } from "../../components/SellingProductForm";
import { GET_SELLING_PRODUCT_BY_ID } from "../../../../../../lib/graphql/queries/sellingProduct.queries";
import { UPDATE_SELLING_PRODUCT } from "../../../../../../lib/graphql/mutations/sellingProduct.mutations";
import { CreateSellingProductInput } from "@repo/validations";
import { SellingProduct } from "../../types";

export default function EditSellingProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading } = useQuery<{ getSellingProductById: SellingProduct }>(
    GET_SELLING_PRODUCT_BY_ID,
    { variables: { id }, fetchPolicy: "cache-and-network" },
  );

  const [updateProduct, { loading: updating }] = useMutation(
    UPDATE_SELLING_PRODUCT,
    {
      onCompleted() {
        toast.success("Product updated successfully");
        router.push("/selling/products");
      },
    },
  );

  const handleSubmit = async (
    formData: CreateSellingProductInput,
    image: File | null,
  ) => {
    await updateProduct({
      variables: {
        id,
        input: formData,
        ...(image && { image }),
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Edit Product"
        breadcrumbs={[
          { label: "Selling" },
          { label: "All Products", href: "/selling/products" },
          { label: "Edit Product" },
        ]}
      />
      <SellingProductForm
        onSubmit={handleSubmit}
        isLoading={updating}
        editData={data?.getSellingProductById ?? null}
      />
    </div>
  );
}
