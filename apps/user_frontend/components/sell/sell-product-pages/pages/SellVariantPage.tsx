import { StepperHeader } from "../components/StepperHeader";
import { ProductBreadcrumb } from "../components/ProductBreadcrumb";
import { ProductMediaPanel } from "../components/ProductMediaPanel";
import { PriceRangeCard } from "../components/PriceRangeCard";
import type {
  SellingProductDetail,
  SellingVariantItem,
} from "../../../../lib/data/sellingProduct.data";

interface Props {
  categorySlug: string;
  brandSlug: string;
  product: SellingProductDetail;
  variant: SellingVariantItem;
}

export function SellVariantPage({
  categorySlug,
  brandSlug,
  product,
  variant,
}: Props) {
  const ram = variant.ram ?? (product.isConstantRam ? product.ram : null);
  const variantLabel = [ram ? `${ram} RAM` : null, variant.storage]
    .filter(Boolean)
    .join(" / ");

  // "Apple iPhone 18 Pro (12GB/256GB)" once a variant is in view.
  const title =
    ram || variant.storage
      ? `${product.productName} (${[ram, variant.storage].filter(Boolean).join("/")})`
      : product.productName;

  return (
    <div className="min-h-dvh">
      <StepperHeader currentStep={2} />

      <div className="max-w-7xl mx-auto px-4 w-full py-6">
        <ProductBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sell Mobile", href: `/${categorySlug}` },
            { label: brandSlug, href: `/${categorySlug}/${brandSlug}` },
            {
              label: product.productName,
              href: `/${categorySlug}/${brandSlug}/${product.productSeoName}`,
            },
            { label: variantLabel || "Select Variant" },
          ]}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:divide-x md:divide-gray-100">
            <div className="md:pr-10">
              <ProductMediaPanel
                image={product.image}
                alt={`${product.productName} ${variantLabel}`}
                soldBadgeText="8+ sold in last 30 days"
              />
            </div>

            <div className="md:pl-10">
              <h1 className="text-2xl font-bold text-gray-900">Sell {title}</h1>
              {variantLabel && (
                <p className="mt-1 text-sm text-gray-600">{variantLabel}</p>
              )}

              <div className="mt-12">
                <PriceRangeCard
                  low={variant.productPrice}
                  ctaLabel="Get Your Price"
                  // TODO: route to the device-condition step
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
