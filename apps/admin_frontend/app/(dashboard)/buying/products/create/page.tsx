"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { BuyingProductForm } from "../components/BuyingProductForm";
import { CREATE_BUYING_PRODUCT } from "../../../../../lib/graphql/mutations/buyingProduct.mutations";
import { CreateBuyingProductInput } from "@repo/validations";
import { VariantImageState } from "../types";

export default function CreateBuyingProductPage() {
  const router = useRouter();

  const [createProduct, { loading }] = useMutation(CREATE_BUYING_PRODUCT, {
    onCompleted() {
      toast.success(
        "Product created successfully. Images are being processed in the background.",
      );
      router.push("/buying/products");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (
    data: CreateBuyingProductInput,
    variantImageMap: Map<string, VariantImageState>,
    variantKeys: string[],
  ) => {
    // ── Validate each variant has at least one image ──
    for (let i = 0; i < variantKeys.length; i++) {
      const key = variantKeys[i];
      const state = variantImageMap.get(key ?? "");
      if (!state || state.images.length === 0) {
        toast.error(`Variant ${i + 1} must have at least one image`);
        return;
      }
    }

    // ── Build variantImages using variantKey ──
    const variantImages = variantKeys.map((key) => {
      const state = variantImageMap.get(key) ?? {
        images: [],
        defaultImageIndex: 0,
      };
      return {
        variantKey: key,
        defaultImageIndex: state.defaultImageIndex,
        images: state.images.map((e) => e.file),
      };
    });

    await createProduct({
      variables: {
        input: data,
        variantImages,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Add Buying Product"
        breadcrumbs={[
          { label: "Buying" },
          { label: "All Products", href: "/buying/products" },
          { label: "Add Product" },
        ]}
      />
      <BuyingProductForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
