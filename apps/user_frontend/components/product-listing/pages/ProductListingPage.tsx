// components/product-listing/pages/ProductListingPage.tsx
import {
  getAvailableFilters,
  getFilteredBuyingProducts,
} from "../../../lib/data/buyingProduct.data";

import { ListingHeader } from "../ListingHeader";
import { FilterSidebar } from "../FilterSidebar";
import { MobileFilterBar } from "../MobileFilterBar";
import { ProductGrid } from "../ProductGrid";
import { GradeExplainerSection } from "../GradeExplainerSection";
import { BrandComparisonSection } from "../BrandComparisonSection";
import { PhoneInsightsSection } from "../PhoneInsightsSection";
import { ListingFAQSection } from "../ListingFAQSection";

interface Props {
  categorySlug?: string;
  title: string;
  searchParams: Record<string, string | string[] | undefined>;
}

function toArray(val: string | string[] | undefined): string[] | undefined {
  if (!val) return undefined;
  return typeof val === "string" ? val.split(",").filter(Boolean) : val;
}

const SUBTITLE =
  "Looking for reliable and preowned devices at the best prices? HelloFi offers quality checked certified affordable preowned electronics from leading brands including Apple, Samsung, OnePlus, Xiaomi, Vivo, Oppo, Google Pixel, and more.";

export async function ProductListingPage({
  categorySlug,
  title,
  searchParams,
}: Props) {
  const filters = await getAvailableFilters(
    categorySlug ? [categorySlug] : undefined,
  );

  if (!filters) return null;

  const initialFilter = {
    categorySlugs: categorySlug ? [categorySlug] : undefined,
    brands: toArray(searchParams.brand),
    storages: toArray(searchParams.storage),
    rams: toArray(searchParams.ram),
    battery: toArray(searchParams.battery),
    screenSizes: toArray(searchParams.screenSize),
    warrantyTypes: toArray(searchParams.warranty),
    priceMin: searchParams.price_min
      ? Number(searchParams.price_min)
      : undefined,
    priceMax: searchParams.price_max
      ? Number(searchParams.price_max)
      : undefined,
    sort:
      typeof searchParams.sort === "string"
        ? searchParams.sort.toUpperCase()
        : undefined,
    limit: 10,
  };

  const initialData = await getFilteredBuyingProducts(initialFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 sm:pb-6">
      <ListingHeader
        title={title}
        subtitle={SUBTITLE}
        totalCount={initialData.total ?? initialData.items.length}
        activeCategory={categorySlug}
      />

      <div className="flex items-start gap-5">
        <div className="hidden sm:block w-[25%] shrink-0 self-stretch">
          <FilterSidebar filters={filters} />
        </div>

        <div className="w-full sm:w-[75%] min-w-0">
          <ProductGrid
            categorySlug={categorySlug}
            initialItems={initialData.items}
            initialNextCursor={initialData.nextCursor}
            initialHasMore={initialData.hasMore}
          />
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex flex-col gap-6 sm:gap-8">
        <GradeExplainerSection />
        <BrandComparisonSection />
        <PhoneInsightsSection />
        <ListingFAQSection />
      </div>

      <MobileFilterBar filters={filters} />
    </div>
  );
}
