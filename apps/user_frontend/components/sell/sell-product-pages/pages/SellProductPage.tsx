// components/sell/sell-product-pages/pages/SellProductPage.tsx
import { StepperHeader } from "../components/StepperHeader";
import { ProductBreadcrumb } from "../components/ProductBreadcrumb";
import { ProductMediaPanel } from "../components/ProductMediaPanel";
import { VariantSelector } from "../components/VariantSelector";
import { QuickSummarySection } from "../components/seo/QuickSummarySection";
import { OtherVariantsSection } from "../components/seo/OtherVariantsSection";
import { VisitStoreSection } from "../components/seo/VisitStoreSection";
import { sizeToSlug } from "../../../../lib/utlils/sellSlug";
import type { SellingProductDetail } from "../../../../lib/data/sellingProduct.data";

interface Props {
  categorySlug: string;
  brandSlug: string;
  product: SellingProductDetail;
}

export function SellProductPage({ categorySlug, brandSlug, product }: Props) {
  const needsRam = !product.isConstantRam;

  const allPrices = product.variants.map((v) => v.productPrice);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const formattedMaxPrice = `₹${Math.round(maxPrice).toLocaleString("en-IN")}`;

  const otherVariants = product.variants.map((v) => {
    const ramForSlug = needsRam ? v.ram : product.ram;
    const slugParts = [
      product.productSeoName,
      ramForSlug ? sizeToSlug(ramForSlug) : null,
      sizeToSlug(v.storage),
    ].filter(Boolean);
    const ramLabel = needsRam ? v.ram : product.ram;
    const specLabel = [ramLabel, v.storage].filter(Boolean).join(" / ");

    return {
      label: `${product.productName} ${specLabel}`,
      shortLabel: specLabel, // mobile: only RAM / storage
      href: `/${categorySlug}/${brandSlug}/${slugParts.join("-")}`,
    };
  });

  return (
    <div className="min-h-dvh">
      <StepperHeader currentStep={2} />
      <div className="max-w-7xl mx-auto px-4 w-full py-6">
        <ProductBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sell Mobile", href: `/${categorySlug}` },
            { label: brandSlug, href: `/${categorySlug}/${brandSlug}` },
            { label: product.productName },
            { label: "Select Variant" },
          ]}
        />

        {/* Single outer card wrapping the whole thing — only a vertical
            divider separates the two columns on desktop, no nested box. */}
        <div className="rounded-none sm:rounded-2xl border-0 sm:border sm:border-gray-200 bg-transparent sm:bg-white shadow-none sm:shadow-sm p-0 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 sm:gap-10 md:divide-x md:divide-gray-100">
            <div className="md:pr-10">
              <ProductMediaPanel
                image={product.image}
                alt={product.productName}
                productName={product.productName}
              />
            </div>

            <div className="md:pl-10">
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">
                  Sell {product.productName}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Get Upto {formattedMaxPrice} with Free Doorstep Pickup and
                  Instant Payment.
                </p>
              </div>

              <div className="mt-4 sm:mt-12">
                <VariantSelector
                  product={product}
                  categorySlug={categorySlug}
                  brandSlug={brandSlug}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <QuickSummarySection
            productName={product.productName}
            low={minPrice}
            high={maxPrice}
          />

          <OtherVariantsSection
            productName={product.productName}
            variants={otherVariants}
          />

          <VisitStoreSection />
        </div>
      </div>
    </div>
  );
}
