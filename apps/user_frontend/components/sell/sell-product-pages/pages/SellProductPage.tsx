// components/sell/sell-product-pages/pages/SellProductPage.tsx
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
  const maxPrice = Math.max(...product.variants.map((v) => v.productPrice));
  const formattedMaxPrice = `₹${Math.round(maxPrice).toLocaleString("en-IN")}`;

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

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:divide-x md:divide-gray-100">
            <div className="md:pr-10">
              <ProductMediaPanel
                image={product.image}
                alt={product.productName}
              />
            </div>

            <div className="md:pl-10">
              <h1 className="text-2xl font-bold text-gray-900">
                Sell {product.productName}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Get Upto {formattedMaxPrice} with Free Doorstep Pickup and
                Instant Payment.
              </p>

              <div className="mt-12">
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
