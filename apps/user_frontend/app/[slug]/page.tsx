import { notFound } from "next/navigation";
import { Banner } from "../../components/category-page/Banner";
import { TrustBadgeStrip } from "../../components/category-page/TrustBadgeStrip";
import { CategoryGrid } from "../../components/category-page/CategoryGrid";
import { MostLovedSection } from "../../components/category-page/MostLovedSection";
import { ShopByBudget } from "../../components/category-page/ShopByBudget";
import { PhonesPeopleLoveSection } from "../../components/category-page/PhonesPeopleLoveSection";
import { ShopByBrand } from "../../components/category-page/ShopByBrand";
import { TopSellingLaptopsSection } from "../../components/category-page/TopSellingLaptopsSection";
import { QualityGradeSection } from "../../components/category-page/QualityGradeSection";
import { CertificationProcessSection } from "../../components/category-page/CertificationProcessSection";
import { TabletsIpadSection } from "../../components/category-page/TabletsIpadSection";
import { LatestSmartwatchesSection } from "../../components/category-page/LatestSmartwatchesSection";
import { OtherGadgetsSection } from "../../components/category-page/OtherGadgetsSection";
import { CertifiedPreownedSection } from "../../components/category-page/CertifiedPreownedSection";
import { KeyFeaturesSection } from "../../components/category-page/KeyFeaturesSection";
import { PreownedFAQSection } from "../../components/category-page/PreownedFAQSection";
import { CustomerReviewsSection } from "../../components/category-page/CustomerReviewsSection";
import { BlogSection } from "../../components/category-page/BlogSection";
import { EMIOptionsSection } from "../../components/category-page/EMIOptionsSection";
import { LaptopDealsSection } from "../../components/category-page/LaptopDealsSection";

// BUY categories: slug after "buy-used-"
const BUY_MAP: Record<
  string,
  { title: string; category: string | null; placement: string }
> = {
  gadgets: { title: "Buy Used Gadgets", category: "all", placement: "BUY_ALL" },
  // "mobile-phones": {
  //   title: "Buy Used Mobile Phones",
  //   category: "mobile-phones",
  //   placement: "BUY_MOBILE",
  // },
  // laptops: {
  //   title: "Buy Used Laptops",
  //   category: "laptops",
  //   placement: "BUY_LAPTOP",
  // },
  // tablets: {
  //   title: "Buy Used Tablets",
  //   category: "tablets",
  //   placement: "BUY_TABLET",
  // },
  // smartwatches: {
  //   title: "Buy Used Smartwatches",
  //   category: "smartwatches",
  //   placement: "BUY_SMARTWATCH",
  // },
  // accessories: {
  //   title: "Buy Used Accessories",
  //   category: "accessories",
  //   placement: "BUY_ACCESSORIES",
  // },
};

// SELL categories: slug after "sell-old-" / "sell-other-"
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

  // ---------- BUY ----------
  if (slug.startsWith("buy-used-")) {
    const key = slug.replace("buy-used-", "");
    const info = BUY_MAP[key];
    if (!info) notFound();

    // TODO: your BUY api call here using info.category (null = all)
    return (
      <div className="min-h-dvh flex flex-col gap-6 py-10">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <Banner placement={info.placement} />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <TrustBadgeStrip />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <CategoryGrid />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <MostLovedSection />
        </div>
        <ShopByBudget />
        <div className="max-w-7xl mx-auto px-4 w-full">
          <PhonesPeopleLoveSection />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <ShopByBrand />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <TopSellingLaptopsSection />
        </div>
        <LaptopDealsSection />
        <div className="max-w-7xl mx-auto px-4 w-full">
          <QualityGradeSection />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <CertificationProcessSection />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <TabletsIpadSection />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <LatestSmartwatchesSection />
        </div>
        <EMIOptionsSection />
        <div className="max-w-7xl mx-auto px-4 w-full">
          <OtherGadgetsSection />
        </div>

        <CustomerReviewsSection />

        <BlogSection />

        <PreownedFAQSection />

        <CertifiedPreownedSection />

        <KeyFeaturesSection />
      </div>
    );
  }

  // ---------- SELL ----------
  if (slug.startsWith("sell-old-") || slug.startsWith("sell-other-")) {
    const key = slug.replace("sell-old-", "").replace("sell-other-", "");
    const info = SELL_MAP[key];
    if (!info) notFound();

    // TODO: your SELL api call here using info.category
    return (
      <div className="min-h-dvh py-10">
        <div className="max-w-7xl mx-auto px-4">
          <Banner placement={info.placement} />
        </div>
      </div>
    );
  }

  // anything else -> not found
  notFound();
}
