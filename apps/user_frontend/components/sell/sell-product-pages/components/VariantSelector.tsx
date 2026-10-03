// components/sell/sell-product-pages/components/VariantSelector.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OptionPillGroup } from "./OptionPillGroup";
import { PriceRangeCard } from "./PriceRangeCard";
import { sizeToSlug } from "../../../../lib/utlils/sellSlug";
import type { SellingProductDetail } from "../../../../lib/data/sellingProduct.data";

interface Props {
  product: SellingProductDetail;
  categorySlug: string;
  brandSlug: string;
}

export function VariantSelector({ product, categorySlug, brandSlug }: Props) {
  const router = useRouter();
  const needsRam = !product.isConstantRam;

  const options = useMemo(
    () =>
      product.variants.map((v) => ({
        id: v.id,
        label: needsRam && v.ram ? `${v.ram} | ${v.storage}` : v.storage,
      })),
    [product.variants, needsRam],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allPrices = product.variants.map((v) => v.productPrice);
  const globalLow = Math.min(...allPrices);
  const globalHigh = Math.max(...allPrices);

  const selectedVariant = product.variants.find((v) => v.id === selectedId);
  const isComplete = !!selectedVariant;

  const navigateToVariant = (variant: (typeof product.variants)[number]) => {
    const ramForSlug = needsRam ? variant.ram : product.ram;
    const slugParts = [
      product.productSeoName,
      ramForSlug ? sizeToSlug(ramForSlug) : null,
      sizeToSlug(variant.storage),
    ].filter(Boolean);
    router.push(`/${categorySlug}/${brandSlug}/${slugParts.join("-")}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <OptionPillGroup
        label={needsRam ? "Select RAM | Storage" : "Select Storage"}
        options={options.map((o) => o.label)}
        selected={
          selectedVariant
            ? (options.find((o) => o.id === selectedVariant.id)?.label ?? null)
            : null
        }
        onSelect={(value) => {
          const match = options.find((o) => o.label === value);
          if (!match) return;
          setSelectedId(match.id);

          // Selecting a pill navigates immediately — no separate CTA needed.
          const variant = product.variants.find((v) => v.id === match.id);
          if (variant) navigateToVariant(variant);
        }}
        variant="check"
      />

      {isComplete && selectedVariant ? (
        <PriceRangeCard low={selectedVariant.productPrice} />
      ) : (
        <PriceRangeCard low={globalLow} high={globalHigh} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 pt-1">
        <span className="inline-flex items-center gap-1.5">
          🔒 Privacy protected valuations
        </span>
        <span>
          Can&apos;t find your variant?{" "}
          <a
            href="/contact"
            className="text-[#0066FF] font-semibold hover:underline"
          >
            Contact Support
          </a>
        </span>
      </div>
    </div>
  );
}
