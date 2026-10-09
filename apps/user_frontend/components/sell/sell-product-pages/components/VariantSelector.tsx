// components/sell/sell-product-pages/components/VariantSelector.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@repo/ui";
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
    <>
      {/* Tightened from gap-4 sm:gap-12 → gap-3 sm:gap-6 so the pills sit
          closer to the heading and the price card isn't miles below. */}
      <div className="flex flex-col gap-3 sm:gap-6">
        <Reveal y={14}>
          <OptionPillGroup
            label={needsRam ? "Select RAM | Storage" : "Select Storage"}
            options={options.map((o) => o.label)}
            selected={
              selectedVariant
                ? (options.find((o) => o.id === selectedVariant.id)?.label ??
                  null)
                : null
            }
            onSelect={(value) => {
              const match = options.find((o) => o.label === value);
              if (!match) return;
              setSelectedId(match.id);
              const variant = product.variants.find((v) => v.id === match.id);
              if (variant) navigateToVariant(variant);
            }}
            variant="check"
          />
        </Reveal>

        <Reveal y={14} delay={0.08}>
          {isComplete && selectedVariant ? (
            <PriceRangeCard low={selectedVariant.productPrice} />
          ) : (
            <PriceRangeCard low={globalLow} high={globalHigh} />
          )}
        </Reveal>
      </div>

      {/* Added top padding (pt-4) that was missing, and a vertical divider
          between the two halves instead of just a gap. */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 pt-4 mt-4 border-t border-gray-100">
        <span className="inline-flex items-center gap-1.5">
          🔒 Privacy protected valuations
        </span>
        <span className="h-4 w-px bg-gray-200 hidden sm:block" />
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
    </>
  );
}
