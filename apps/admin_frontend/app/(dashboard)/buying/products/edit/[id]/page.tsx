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
import { VariantImageState } from "../../types";

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
      onError(error) {
        toast.error(error.message);
      },
    },
  );

  const handleSubmit = async (
    formData: CreateBuyingProductInput,
    variantImageMap: Map<string, VariantImageState>,
    variantKeys: string[],
  ) => {
    const variantImages = variantKeys.map((key) => {
      const state = variantImageMap.get(key) ?? {
        images: [],
        defaultImageIndex: 0,
      };
      const newImages = state.images.filter(
        (img) => !img.isExisting && img.file,
      );
      const existingImageKeys = state.images
        .filter((img) => img.isExisting)
        .map((img) => img.s3Key);

      return {
        variantKey: key,
        defaultImageIndex: state.defaultImageIndex,
        images: newImages.map((e) => e.file as File),
        existingImageKeys,
      };
    });

    // ── Sanitize variants — remove empty string enums ──
    const sanitizedInput = {
      ...formData,
      variants: (formData.variants ?? []).map((v: any) => ({
        ...v,
        os: v.os || undefined, // "" → undefined
        condition: v.condition || undefined,
        availability: v.availability || undefined,
        warrantyType: v.warrantyType || undefined,
      })),
    };

    await updateProduct({
      variables: { id, input: sanitizedInput, variantImages },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[rgb(33,76,123)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.getBuyingProductById) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Product not found.
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
        onSubmit={handleSubmit}
        isLoading={updating}
        editData={data.getBuyingProductById}
      />
    </div>
  );
}
