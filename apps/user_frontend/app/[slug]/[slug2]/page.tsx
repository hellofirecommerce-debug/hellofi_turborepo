// app/[slug]/[slug2]/page.tsx
import { notFound } from "next/navigation";
import { ProductListingPage } from "../../../components/product-listing/pages/ProductListingPage";
import { ModelSelectionPage } from "../../../components/model-selection/pages/ModelSelectionPage";

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

const SELL_MAP: Record<
  string,
  { title: string; category: string; placement: string }
> = {
  "mobile-phone": {
    title: "Sell Mobile Phone",
    category: "mobile-phone",
    placement: "SELL_MOBILE",
  },
  laptop: {
    title: "Sell Laptop",
    category: "laptop",
    placement: "SELL_LAPTOP",
  },
  tablet: {
    title: "Sell Tablet",
    category: "tablet",
    placement: "SELL_TABLET",
  },
  "smart-watch": {
    title: "Sell Smartwatch",
    category: "smart-watch",
    placement: "SELL_SMARTWATCH",
  },
  accessories: {
    title: "Sell Accessories",
    category: "accessories",
    placement: "SELL_ACCESSORIES",
  },
};

export default async function DynamicSecondLevelRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; slug2: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug, slug2 } = await params;
  const resolvedSearchParams = await searchParams;

  // ── Buy flow: /buy-used-<category>/<something> → product listing ──
  if (slug.startsWith("buy-used-")) {
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

  // ── Sell flow: /sell-old-<category>/<brand> → model selection ──
  if (slug.startsWith("sell-old-")) {
    const key = slug.replace("sell-old-", "");
    const info = SELL_MAP[key];
    if (!info) notFound();

    return (
      <ModelSelectionPage
        categorySlug={info.category}
        brandSlug={slug2}
        title={info.title}
      />
    );
  }

  notFound();
}
