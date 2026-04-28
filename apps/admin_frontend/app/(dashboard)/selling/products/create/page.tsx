"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { SellingProductForm } from "../components/SellingProductForm";
import { CREATE_SELLING_PRODUCT } from "../../../../../lib/graphql/mutations/sellingProduct.mutations";
import { CreateSellingProductInput } from "@repo/validations";

export default function CreateSellingProductPage() {
  const router = useRouter();

  const [createProduct, { loading }] = useMutation(CREATE_SELLING_PRODUCT, {
    onCompleted() {
      toast.success("Product created successfully");
      router.push("/selling/products");
    },
  });

  const handleSubmit = async (
    data: CreateSellingProductInput,
    image: File | null,
  ) => {
    if (!image) {
      toast.error("Please upload a product image");
      return;
    }
    await createProduct({
      variables: { input: data, image },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Add Product"
        breadcrumbs={[
          { label: "Selling" },
          { label: "All Products", href: "/selling/products" },
          { label: "Add Product" },
        ]}
      />
      <SellingProductForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
