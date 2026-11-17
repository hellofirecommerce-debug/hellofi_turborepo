import { StepperHeader } from "../../sell-product-pages/components/StepperHeader";
import { ProductBreadcrumb } from "../../sell-product-pages/components/ProductBreadcrumb";
import { ConditionClient } from "../components/ConditionClient";

interface Props {
  categorySlug: string;
  brandSlug: string;
  variantSlug: string;
  product: any;
  variant: any;
}

export function SellConditionPage({
  categorySlug,
  brandSlug,
  variantSlug,
  product,
  variant,
}: Props) {
  const ram = variant.ram ?? (product.isConstantRam ? product.ram : null);
  const spec = [variant.storage, ram].filter(Boolean).join(" / ");
  const deviceName = `${product.productName}${spec ? ` · ${spec}` : ""}`;

  // 👇 Remove the 'sell-old-' prefix
  const cleanCategorySlug = categorySlug.replace(/^sell-old-/, "");

  return (
    <div className="min-h-dvh bg-[#F8FAFF]">
      <StepperHeader currentStep={3} />
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <ProductBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Sell Mobile", href: `/${categorySlug}` },
            { label: brandSlug, href: `/${categorySlug}/${brandSlug}` },
            { label: "Device Condition" },
          ]}
        />
        <ConditionClient
          productId={product.id}
          variantId={variant.id}
          categorySlug={cleanCategorySlug} // 👈 Pass the clean slug to the Client
          brandSlug={brandSlug}
          productSlug={variantSlug}
          deviceName={deviceName}
          image={`${process.env.NEXT_PUBLIC_CDN_URL}/${product.image}`}
          changeHref={`/${categorySlug}/${brandSlug}/${product.productSeoName}`}
        />
      </div>
    </div>
  );
}
