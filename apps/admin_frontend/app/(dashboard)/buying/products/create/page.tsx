"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { BuyingProductForm } from "../components/BuyingProductForm";
import { CREATE_BUYING_PRODUCT } from "../../../../../lib/graphql/mutations/buyingProduct.mutations";
import { CreateBuyingProductInput } from "@repo/validations";

interface VariantImageState {
  images: { file: File; preview: string }[];
  defaultImageIndex: number;
}

export default function CreateBuyingProductPage() {
  const router = useRouter();

  const [createProduct, { loading }] = useMutation(CREATE_BUYING_PRODUCT, {
    onCompleted() {
      toast.success(
        "Product created successfully. Images are being processed in the background.",
      );
      router.push("/buying/products");
    },
  });

  const handleSubmit = async (
    data: CreateBuyingProductInput,
    productImages: File[],
    productDefaultImageIndex: number,
    variantImageStates: VariantImageState[],
  ) => {
    // ── Validate each variant has at least one image ──
    const variantCount = data.variants?.length ?? 0;
    for (let i = 0; i < variantCount; i++) {
      const state = variantImageStates[i];
      if (!state || state.images.length === 0) {
        toast.error(`Variant ${i + 1} must have at least one image`);
        return;
      }
    }

    const variantImages = variantImageStates.map((state, index) => ({
      variantIndex: index,
      defaultImageIndex: state.defaultImageIndex,
      images: state.images.map((e) => e.file),
    }));

    await createProduct({
      variables: {
        input: data,
        productImages: undefined,
        productDefaultImageIndex: 0,
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
