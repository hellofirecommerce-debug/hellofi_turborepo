"use client";
import React from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "../../../../../components/ui/PageHeader";
import { InventoryForm } from "../../components/InventoryForm";
import { GET_INVENTORY_PRODUCT_BY_ID } from "../../../../../lib/graphql/queries/inventory.queries";
import { UPDATE_INVENTORY_PRODUCT } from "../../../../../lib/graphql/mutations/inventory.mutations";
import { InventoryProduct } from "../../types";
import { Skeleton } from "@repo/ui";
import {
  CreateInventoryProductInput,
  UpdateInventoryProductInput,
} from "@repo/validations";
import { useNavigate } from "../../../../../lib/hooks/useNavigate";

export default function EditInventoryPage() {
  const router = useRouter();
  const { navigate } = useNavigate();
  const params = useParams();
  const id = params.id as string;

  const { data, loading: fetching } = useQuery<{
    getInventoryProductById: InventoryProduct;
  }>(GET_INVENTORY_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [updateInventoryProduct, { loading: updating }] = useMutation(
    UPDATE_INVENTORY_PRODUCT,
    {
      onCompleted() {
        toast.success("Product updated successfully");
        navigate("/inventory");
      },
    },
  );

  const handleSubmit = async (
    formData: CreateInventoryProductInput | UpdateInventoryProductInput,
  ) => {
    const input = formData as UpdateInventoryProductInput;
    await updateInventoryProduct({
      variables: {
        input: {
          id: input.id,
          imeiOrSerial: input.imeiOrSerial,
          brandId: input.brandId,
          categoryId: input.categoryId,
          purchaseDate: input.purchaseDate,
          productName: input.productName,
          ram: input.ram,
          storage: input.storage,
          costPrice: input.costPrice,
          otherCharges: input.otherCharges,
          customerName: input.customerName,
          customerEmail: input.customerEmail || undefined,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          status: input.status,
          notes: input.notes || undefined,
          screenCondition: input.screenCondition,
          bodyCondition: input.bodyCondition,
          deviceIssues: input.deviceIssues || undefined,
          hasBox: input.hasBox,
          hasCharger: input.hasCharger,
          hasOriginalBill: input.hasOriginalBill,
          warrantyType: input.warrantyType,
          warrantyPurchaseDate:
            input.warrantyType === "BELOW_1_YEAR"
              ? input.warrantyPurchaseDate || undefined
              : undefined,
        },
      },
    });
  };

  if (fetching) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const product = data?.getInventoryProductById;

  return (
    <div>
      <PageHeader
        title="Edit Product"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Edit Product" },
        ]}
      />
      <InventoryForm
        editData={product}
        onSubmit={handleSubmit}
        isLoading={updating}
      />
    </div>
  );
}
