"use client";
import React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "../../../../../../components/ui/PageHeader";
import { BuyingProductForm } from "../../components/BuyingProductForm";
import { GET_BUYING_PRODUCT_BY_ID } from "../../../../../../lib/graphql/queries/buyingProduct.queries";
import { UPDATE_BUYING_PRODUCT } from "../../../../../../lib/graphql/mutations/buyingProduct.mutations";
import { CreateBuyingProductInput } from "@repo/validations";
import { BuyingProduct } from "../../types";

export default function EditBuyingProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading } = useQuery<{ getBuyingProductById: BuyingProduct }>(
    GET_BUYING_PRODUCT_BY_ID,
    { variables: { id }, fetchPolicy: "cache-and-network" },
  );

  const [updateProduct, { loading: updating }] = useMutation(
    UPDATE_BUYING_PRODUCT,
    {
      onCompleted() {
        toast.success("Product updated successfully");
        router.push("/buying/products");
      },
    },
  );

  const handleSubmit = async (formData: CreateBuyingProductInput) => {
    await updateProduct({
      variables: { id, input: formData },
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
          { label: "Buying" },
          { label: "All Products", href: "/buying/products" },
          { label: "Edit Product" },
        ]}
      />
      <BuyingProductForm
        onSubmit={handleSubmit as any}
        isLoading={updating}
        editData={data?.getBuyingProductById ?? null}
      />
    </div>
  );
}
