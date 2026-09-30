import { StepperHeader } from "../components/StepperHeader";
import { ProductBreadcrumb } from "../components/ProductBreadcrumb";
import { ProductMediaPanel } from "../components/ProductMediaPanel";
import { VariantSelector } from "../components/VariantSelector";
import type { SellingProductDetail } from "../../../../lib/data/sellingProduct.data";

interface Props {
  categorySlug: string;
  brandSlug: string;
  product: SellingProductDetail;
}

export function SellProductPage({ categorySlug, brandSlug, product }: Props) {
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

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductMediaPanel
              image={product.image}
              alt={product.productName}
              soldBadgeText="8+ sold in last 30 days"
            />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sell {product.productName}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Select your variant to get an estimated price
              </p>

              <div className="mt-6">
                <VariantSelector
                  product={product}
                  categorySlug={categorySlug}
                  brandSlug={brandSlug}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
