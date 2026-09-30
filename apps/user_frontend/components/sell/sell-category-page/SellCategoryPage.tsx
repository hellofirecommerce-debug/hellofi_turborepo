// components/sell-category-page/pages/SellCategoryPage.tsx
import { Banner } from "../../category-page/shared/Banner";
import { SellCompareTable } from "./components/SellCompareTable";
import { SellHero } from "./components/SellHero";
import { SellHowItWorks } from "./components/SellHowItWorks";
import { SellPopularBrands } from "./components/SellPopularBrands";
import { SellStats } from "./components/SellStats";
import { SellSteps } from "./components/SellSteps";
import { SellTopModels } from "./components/SellTopModels";
import { SellWhyHelloFi } from "./components/SellWhyHelloFi";
import { SellFAQSection } from "./components/SellFAQSection";
import { SellSEOContent } from "./components/SellSEOContent";

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
