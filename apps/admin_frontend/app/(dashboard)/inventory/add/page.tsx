"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { InventoryForm } from "../components/InventoryForm";
import { CREATE_INVENTORY_PRODUCT } from "../../../../lib/graphql/mutations/inventory.mutations";
import { useNavigate } from "../../../../lib/hooks/useNavigate";

export default function AddInventoryPage() {
  const { navigate } = useNavigate();
  const [createInventoryProduct, { loading }] = useMutation(
    CREATE_INVENTORY_PRODUCT,
    {
      onCompleted() {
        toast.success("Product added to inventory");
        navigate("/inventory");
      },
    },
  );

  const handleSubmit = async (formData: any) => {
    await createInventoryProduct({
      variables: {
        input: {
          imeiOrSerial: formData.imeiOrSerial,
          brandId: formData.brandId,
          categoryId: formData.categoryId,
          purchaseDate: formData.purchaseDate,
          productName: formData.productName,
          ram: formData.ram,
          storage: formData.storage,
          costPrice: formData.costPrice,
          otherCharges: formData.otherCharges,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail || undefined,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          status: formData.status,
          notes: formData.notes || undefined,
          // Device Condition
          screenCondition: formData.screenCondition,
          bodyCondition: formData.bodyCondition,
          deviceIssues: formData.deviceIssues || undefined,
          // Accessories
          hasBox: formData.hasBox,
          hasCharger: formData.hasCharger,
          hasOriginalBill: formData.hasOriginalBill,
          // Warranty
          warrantyType: formData.warrantyType,
          warrantyPurchaseDate:
            formData.warrantyType === "BELOW_1_YEAR"
              ? formData.warrantyPurchaseDate || undefined
              : undefined,
        },
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Add Product"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Add Product" },
        ]}
      />
      <InventoryForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
