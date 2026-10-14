// pages/SellProductPage.tsx
import { StepperHeader } from "../components/StepperHeader";
import { ProductBreadcrumb } from "../components/ProductBreadcrumb";
import { ProductMediaPanel } from "../components/ProductMediaPanel";
import { VariantSelector } from "../components/VariantSelector";
import { TrustStrip } from "../components/TrustStrip";
import { QuickSummarySection } from "../components/seo/QuickSummarySection";
import { OtherVariantsSection } from "../components/seo/OtherVariantsSection";
import { VisitStoreSection } from "../components/seo/VisitStoreSection";
import { sizeToSlug } from "../../../../lib/utlils/sellSlug";
import type { SellingProductDetail } from "../../../../lib/data/sellingProduct.data";
import { MotionProvider, Reveal } from "@repo/ui";

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
      shortLabel: specLabel,
      href: `/${categorySlug}/${brandSlug}/${slugParts.join("-")}`,
    };
  });

  return (
    <MotionProvider>
      <div className="page-bg">
        <StepperHeader currentStep={2} />
        <div className="max-w-7xl mx-auto px-4 w-full py-6">
          <ProductBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Sell Mobile", href: `/${categorySlug}` },
              { label: brandSlug, href: `/${categorySlug}/${brandSlug}` },
              { label: product.productName },
            ]}
          />

          <Reveal y={20}>
            <div className="rounded-none md:rounded-2xl border-0 md:border md:border-gray-200 bg-transparent md:bg-white shadow-none md:shadow-sm p-0 md:p-5 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2  gap-4 sm:gap-4 md:gap-0 lg:gap-4 md:divide-x md:divide-gray-100">
                <div className="md:pr-5 lg:pr-5">
                  <ProductMediaPanel
                    image={product.image}
                    alt={product.productName}
                    productName={product.productName}
                  />
                </div>

                <div className="md:pl-5 lg:pr-5">
                  {/* Heading/subtitle block now shows from md (768px), not
                      sm (640px) — matches ProductMediaPanel's own mobile
                      view, which already renders its own title below md. */}
                  <div className="hidden md:block">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Sell {product.productName}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Get Upto {formattedMaxPrice} with Free Doorstep Pickup and
                      Instant Payment.
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <VariantSelector
                      product={product}
                      categorySlug={categorySlug}
                      brandSlug={brandSlug}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <TrustStrip />

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
    </MotionProvider>
  );
}
