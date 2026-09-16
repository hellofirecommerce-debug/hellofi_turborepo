// components/sell-category-page/pages/SellCategoryPage.tsx
import { Banner } from "../../category-page/shared/Banner";
import { SellHero } from "../SellHero";
import { SellPopularBrands } from "../SellPopularBrands";

interface Props {
  placement: string;
  category: string;
}

export function SellCategoryPage({ placement, category }: Props) {
  return (
    <div className="min-h-dvh flex flex-col gap-6 py-10">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <Banner placement={placement} />
      </div>

      <SellHero categorySlug={category} />
      <SellPopularBrands categorySlug={category} />
    </div>
  );
}
