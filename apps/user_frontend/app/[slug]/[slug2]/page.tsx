// app/[slug]/[slug2]/page.tsx
import { notFound } from "next/navigation";
import { ProductListingPage } from "../../../components/product-listing/pages/ProductListingPage";

const BUY_MAP: Record<
  string,
  { title: string; category: string | null; placement: string }
> = {
  gadgets: { title: "Buy Used Gadgets", category: null, placement: "BUY_ALL" },
  "mobile-phones": {
    title: "Buy Used Mobile Phones",
    category: "mobile-phone",
    placement: "BUY_MOBILE",
  },
  laptops: {
    title: "Buy Used Laptops",
    category: "laptop",
    placement: "BUY_LAPTOP",
  },
  tablets: {
    title: "Buy Used Tablets",
    category: "tablet",
    placement: "BUY_TABLET",
  },
  smartwatches: {
    title: "Buy Used Smartwatches",
    category: "smart-watch",
    placement: "BUY_SMARTWATCH",
  },
};

export default async function ProductListingRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; slug2: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  if (!slug.startsWith("buy-used-")) {
    notFound();
  }

  const key = slug.replace("buy-used-", "");
  const info = BUY_MAP[key];
  if (!info) notFound();

  return (
    <ProductListingPage
      categorySlug={info.category ?? undefined}
      title={info.title}
      searchParams={resolvedSearchParams}
    />
  );
}
