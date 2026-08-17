import { notFound } from "next/navigation";
import { BuyGadgetsPage } from "../../components/category-page/pages/BuyGadgetsPage";
import { BuyCategoryPage } from "../../components/category-page/pages/BuyCategoryPage";
import { Banner } from "../../components/category-page/shared/Banner";

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
  // laptops: {
  //   title: "Buy Used Laptops",
  //   category: "laptop",
  //   placement: "BUY_LAPTOP",
  // },
  // tablets: {
  //   title: "Buy Used Tablets",
  //   category: "tablet",
  //   placement: "BUY_TABLET",
  // },
  // smartwatches: {
  //   title: "Buy Used Smartwatches",
  //   category: "smartwatch",
  //   placement: "BUY_SMARTWATCH",
  // },
};

const SELL_MAP: Record<
  string,
  { title: string; category: string; placement: string }
> = {
  "mobile-phone": {
    title: "Sell Old Mobile Phone",
    category: "mobile-phone",
    placement: "SELL_MOBILE",
  },
  laptop: {
    title: "Sell Old Laptop",
    category: "laptop",
    placement: "SELL_LAPTOP",
  },
  tablet: {
    title: "Sell Old Tablet",
    category: "tablet",
    placement: "SELL_TABLET",
  },
  "smart-watch": {
    title: "Sell Old Smart Watch",
    category: "smart-watch",
    placement: "SELL_SMARTWATCH",
  },
  accessories: {
    title: "Sell Other Accessories",
    category: "accessories",
    placement: "SELL_ACCESSORIES",
  },
};

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug.startsWith("buy-used-")) {
    const key = slug.replace("buy-used-", "");
    console.log("This is the key:", key);
    const info = BUY_MAP[key];
    if (!info) notFound();

    if (key === "gadgets") {
      return (
        <BuyGadgetsPage
          placement={info.placement}
          categorySlug={info.category ?? undefined}
        />
      );
    }

    return (
      <BuyCategoryPage placement={info.placement} category={info.category!} />
    );
  }

  if (slug.startsWith("sell-old-") || slug.startsWith("sell-other-")) {
    const key = slug.replace("sell-old-", "").replace("sell-other-", "");
    const info = SELL_MAP[key];
    if (!info) notFound();

    return (
      <div className="min-h-dvh py-10">
        <div className="max-w-7xl mx-auto px-4">
          <Banner placement={info.placement} />
        </div>
      </div>
    );
  }

  notFound();
}
