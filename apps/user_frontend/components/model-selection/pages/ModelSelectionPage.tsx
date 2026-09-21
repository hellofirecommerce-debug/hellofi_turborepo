// components/model-selection/pages/ModelSelectionPage.tsx
import { TrustBadgeStrip } from "../TrustBadgeStrip";
import { ModelSelectionClient } from "../components/ModelSelectionClient";
import { getSeriesByBrandSeoName } from "../../../lib/data/series.data";
import { getSellingProductsByBrand } from "../../../lib/data/sellingProduct.data";

interface Props {
  categorySlug: string;
  brandSlug: string;
  title: string;
}

export async function ModelSelectionPage({
  categorySlug,
  brandSlug,
  title,
}: Props) {
  const [series, firstPage] = await Promise.all([
    getSeriesByBrandSeoName(brandSlug, categorySlug),
    getSellingProductsByBrand(brandSlug, categorySlug, 0, 10),
  ]);

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="max-w-7xl mx-auto px-4 w-full py-6 lg:pt-10">
        <nav className="text-xs text-gray-500 mb-2">
          Home &gt; Sell {categorySlug} &gt; {brandSlug} &gt; Select Model
        </nav>

        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-6">
          Select Your {brandSlug} Model
        </h1>

        <TrustBadgeStrip />

        <ModelSelectionClient
          brandSlug={brandSlug}
          categorySlug={categorySlug}
          series={series}
          initialItems={firstPage.items}
          initialHasMore={firstPage.hasMore}
        />
      </div>
    </div>
  );
}
