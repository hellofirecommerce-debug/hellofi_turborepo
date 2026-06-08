"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../../../../../lib/graphql/queries/category.queries";
import { GET_BRANDS } from "../../../../../lib/graphql/queries/brand.queries";
import { BuyingProductBasicInfo } from "./BuyingProductBasicInfo";
import { BuyingProductSpecs } from "./BuyingProductSpecs";
import { BuyingProductVariants } from "./BuyingProductVariants";
import { VariantImageEntry, VariantImageState } from "../types";
import {
  CreateBuyingProductInput,
  CreateBuyingVariantInput,
} from "@repo/validations";
import { BuyingProduct } from "../types";

interface Props {
  onSubmit: (
    data: CreateBuyingProductInput,
    variantImageMap: Map<string, VariantImageState>,
    variantKeys: string[],
  ) => void;
  isLoading?: boolean;
  editData?: BuyingProduct | null;
}

const initialVariant: CreateBuyingVariantInput = {
  variantSubtitle: "",
  inventoryProductId: undefined,
  storage: "",
  ram: "",
  price: 0,
  mrp: 0,
  quantity: 0,
  condition: "GOOD",
  warrantyType: "BRAND_WARRANTY",
  whatsInTheBox: [],
  availability: "IN_STOCK",
  variantKey: "",
};

export const BuyingProductForm: React.FC<Props> = ({
  onSubmit,
  isLoading = false,
  editData = null,
}) => {
  const isEdit = !!editData;

  const [form, setForm] = useState<CreateBuyingProductInput>({
    productName: "",
    productSubtitle: "",
    slug: "",
    brandId: "",
    manualBrand: "",
    categoryId: "",
    isTrending: false,
    specifications: [],
    variants: [],
  });

  const S3_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL;
  const [variantKeys, setVariantKeys] = useState<string[]>([]);
  const [variantImageMap, setVariantImageMap] = useState<
    Map<string, VariantImageState>
  >(new Map());
  const [expandedVariants, setExpandedVariants] = useState<number[]>([0]);

  const { data: categoriesData } = useQuery<{
    getCategories: { id: string; name: string }[];
  }>(GET_CATEGORIES);

  const { data: brandsData } = useQuery<{
    getBrands: {
      id: string;
      name: string;
      brandCategories: { categoryId: string }[];
    }[];
  }>(GET_BRANDS);

  const categories = categoriesData?.getCategories ?? [];
  const allBrands = brandsData?.getBrands ?? [];
  const brands = form.categoryId
    ? allBrands.filter((b) =>
        b.brandCategories?.some((bc) => bc.categoryId === form.categoryId),
      )
    : allBrands;

  useEffect(() => {
    if (editData) {
      const keys = editData.variants.map((v) => v.id);

      setForm({
        productName: editData.productName,
        productSubtitle: editData.productSubtitle,
        slug: editData.slug,
        brandId: editData.brandId,
        manualBrand: editData.manualBrand ?? "",
        categoryId: editData.categoryId,
        isTrending: editData.isTrending,
        specifications: editData.specifications.map((s) => ({
          key: s.key,
          value: s.value,
          group: s.group,
          sortOrder: s.sortOrder,
        })),
        variants: editData.variants.map((v) => ({
          variantKey: v.id,
          variantSubtitle: v.variantSubtitle ?? "",
          inventoryProductId: v.inventoryProductId ?? undefined,
          storage: v.storage ?? "",
          ram: v.ram ?? "",
          color: v.color ?? "",
          colorCode: v.colorCode ?? "",
          price: v.price,
          mrp: v.mrp,
          emiBasePrice: v.emiBasePrice ?? undefined,
          quantity: v.quantity,
          condition: v.condition,
          warrantyType: v.warrantyType,
          warrantyDescription: v.warrantyDescription ?? "",
          whatsInTheBox: v.whatsInTheBox ?? [],
          whatsExtra: v.whatsExtra ?? "",
          availability: v.availability,
          screenSize: v.screenSize ?? "",
          os: (v.os ?? "") as any,
          processor: v.processor ?? "",
          batteryCapacity: v.batteryCapacity ?? "",
          liveLink: v.liveLink ?? "",
        })),
      });

      setVariantKeys(keys);
      setExpandedVariants(keys.map((_, i) => i));

      const imageMap = new Map<string, VariantImageState>();
      editData.variants.forEach((v) => {
        const defaultIndex = v.images.findIndex((img) => img.isDefault);
        imageMap.set(v.id, {
          images: v.images.map((img) => ({
            file: null,
            preview: `${S3_BASE_URL}/${img.md}`,
            s3Key: img.md,
            isExisting: true,
          })),
          defaultImageIndex: defaultIndex >= 0 ? defaultIndex : 0,
        });
      });
      setVariantImageMap(imageMap);
    }
  }, [editData]);

  const selectedCategory = categories.find((c) => c.id === form.categoryId);

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      productName: value,
      slug: value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleFormChange = (
    key: keyof CreateBuyingProductInput,
    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "categoryId" ? { brandId: "" } : {}),
    }));
  };

  const addVariant = () => {
    const key = crypto.randomUUID();
    const newIndex = (form.variants ?? []).length;
    setForm((prev) => ({
      ...prev,
      variants: [
        ...(prev.variants ?? []),
        { ...initialVariant, variantKey: key },
      ],
    }));
    setVariantKeys((prev) => [...prev, key]);
    setVariantImageMap((prev) => {
      const next = new Map(prev);
      next.set(key, { images: [], defaultImageIndex: 0 });
      return next;
    });
    setExpandedVariants((prev) => [...prev, newIndex]);
  };

  const removeVariant = (index: number) => {
    const key = variantKeys[index];
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).filter((_, i) => i !== index),
    }));
    setVariantKeys((prev) => prev.filter((_, i) => i !== index));
    setVariantImageMap((prev) => {
      const next = new Map(prev);
      if (key) next.delete(key);
      return next;
    });
    setExpandedVariants((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  const updateVariant = (
    index: number,
    key: keyof CreateBuyingVariantInput,
    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).map((v, i) =>
        i === index ? { ...v, [key]: value } : v,
      ),
    }));
  };

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [
        ...(prev.specifications ?? []),
        {
          key: "",
          value: "",
          group: "",
          sortOrder: (prev.specifications ?? []).length,
        },
      ],
    }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      specifications: (prev.specifications ?? []).filter((_, i) => i !== index),
    }));
  };

  const updateSpec = (index: number, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      specifications: (prev.specifications ?? []).map((s, i) =>
        i === index ? { ...s, [key]: value } : s,
      ),
    }));
  };

  const handleLoadTemplate = (
    specs: { key: string; value: string; group: string; sortOrder: number }[],
  ) => {
    setForm((prev) => ({ ...prev, specifications: specs }));
  };

  return (
    <div className="flex flex-col gap-6">
      <BuyingProductBasicInfo
        form={form}
        categories={categories}
        brands={brands}
        onNameChange={handleNameChange}
        onChange={handleFormChange}
      />

      <BuyingProductSpecs
        specifications={form.specifications ?? []}
        categoryName={selectedCategory?.name}
        onAdd={addSpec}
        onRemove={removeSpec}
        onUpdate={updateSpec}
        onLoadTemplate={handleLoadTemplate}
      />

      <BuyingProductVariants
        variants={form.variants ?? []}
        variantKeys={variantKeys}
        variantImageMap={variantImageMap}
        expandedVariants={expandedVariants}
        onAdd={addVariant}
        onRemove={removeVariant}
        onUpdate={updateVariant}
        onToggleExpand={(index) =>
          setExpandedVariants((prev) =>
            prev.includes(index)
              ? prev.filter((i) => i !== index)
              : [...prev, index],
          )
        }
        onImagesChange={(key, images) =>
          setVariantImageMap((prev) => {
            const next = new Map(prev);
            const current = next.get(key) ?? {
              images: [],
              defaultImageIndex: 0,
            };
            next.set(key, { ...current, images });
            return next;
          })
        }
        onDefaultChange={(key, defaultImageIndex) =>
          setVariantImageMap((prev) => {
            const next = new Map(prev);
            const current = next.get(key) ?? {
              images: [],
              defaultImageIndex: 0,
            };
            next.set(key, { ...current, defaultImageIndex });
            return next;
          })
        }
      />

      <div className="flex justify-end gap-3 pb-6">
        <Button
          size="md"
          onClick={() => onSubmit(form, variantImageMap, variantKeys)}
          disabled={isLoading}
          className="min-w-40"
        >
          {isLoading ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
        </Button>
      </div>
    </div>
  );
};
