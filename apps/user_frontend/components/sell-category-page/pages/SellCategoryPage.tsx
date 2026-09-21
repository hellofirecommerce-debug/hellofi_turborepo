// components/sell-category-page/pages/SellCategoryPage.tsx
import { Banner } from "../../category-page/shared/Banner";
import { SellCompareTable } from "../SellCompareTable";
import { SellHero } from "../SellHero";
import { SellHowItWorks } from "../SellHowItWorks";
import { SellPopularBrands } from "../SellPopularBrands";
import { SellStats } from "../SellStats";
import { SellSteps } from "../SellSteps";
import { SellTopModels } from "../SellTopModels";
import { SellWhyHelloFi } from "../SellWhyHelloFi";
import { SellFAQSection } from "../SellFAQSection";
import { SellSEOContent } from "../SellSEOContent";

interface Props {
  placement: string;
  category: string;
}

export function SellCategoryPage({ placement, category }: Props) {
  return (
    <div className="min-h-dvh flex flex-col gap-8 py-10">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <Banner placement={placement} />
      </div>

      <SellHero categorySlug={category} />

      <SellPopularBrands categorySlug={category} />
      <SellStats />
      <SellTopModels />
      <SellSteps />
      <SellWhyHelloFi />
      <SellCompareTable />
      <SellHowItWorks />
      <SellFAQSection categorySlug={category} />
      <SellSEOContent categorySlug={category} />
    </div>
  );
}
