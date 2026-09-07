import { Banner } from "../shared/Banner";
import { TrustBadgeStrip } from "../TrustBadgeStrip";
import { MostLovedSection } from "../MostLovedSection";
import { ShopByBudget } from "../ShopByBudget";
import { ShopByBrand } from "../ShopByBrand";
import { QualityGradeSection } from "../QualityGradeSection";
import { CertificationProcessSection } from "../CertificationProcessSection";
import { EMIOptionsSection } from "../EMIOptionsSection";
import { CustomerReviewsSection } from "../CustomerReviewsSection";
import { BlogSection } from "../BlogSection";
import { PreownedFAQSection } from "../PreownedFAQSection";
import { CertifiedPreownedSection } from "../CertifiedPreownedSection";
import { KeyFeaturesSection } from "../KeyFeaturesSection";
import { ServiceHighlightsBar } from "../seperate-category/ServiceHighlightsBar";
import { CategoryGrid } from "../shared/CategoryGrid";
import { BestSellingPlatformBanner } from "../seperate-category/BestSellingPlatformBanner";
import { TopSellingAppleDevices } from "../seperate-category/TopSellingAppleDevices";
import { PriceRangeSection } from "../seperate-category/PriceRangeSection";
import { TopSellingNonAppleDevices } from "../seperate-category/TopSellingNonAppleDevices";
import { BrandLogoStrip } from "../seperate-category/BrandLogoStrip";
import { NotSureWhatToBuySection } from "../seperate-category/seo/NotSureWhatToBuySection";
import { InstagramChatBanner } from "../seperate-category/InstagramChatBanner";

import { CategoryMegaDhamakaSection } from "../seperate-category/CategoryMegaDhamakaSection";
import { ChoosingYourPathSection } from "../seperate-category/seo/ChoosingYourPathSection";
import { HowToChooseSection } from "../shared/HowToChooseSection";
import { VisitStoreSection } from "../shared/VisitStoreSection";
import { PreownedIntroSection } from "../seperate-category/seo/PreownedIntroSection";
import { WhyBuyPreownedGrid } from "../seperate-category/seo/WhyBuyPreownedGrid";
import { PreownedQuoteBanner } from "../seperate-category/seo/PreownedQuoteBanner";
import { PreownedComparisonTable } from "../seperate-category/seo/PreownedComparisonTable";
import { CategoryFAQSection } from "../seperate-category/CategoryFAQSection";
import { CategorySeoContentSection } from "../seperate-category/seo/CategorySeoContentSection";
import { BuyingGuideSection } from "../seperate-category/seo/BuyingGuideSection";
import { StatsSection } from "../seperate-category/seo/StatsSection";

interface Props {
  placement: string;
  category: string; // e.g. "mobile", "laptop", "tablet", "smartwatch"
}

export function BuyCategoryPage({ placement, category }: Props) {
  return (
    <div className="min-h-dvh flex flex-col gap-6 py-10">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <Banner placement={placement} />
      </div>

      <ServiceHighlightsBar />

      <div className="max-w-7xl mx-auto px-4 w-full">
        <CategoryGrid />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <MostLovedSection categorySlug={category} />
      </div>

      <BestSellingPlatformBanner categorySlug={category} />

      <div className="max-w-7xl mx-auto px-4 w-full">
        <TopSellingAppleDevices categorySlug={category} />
      </div>

      <PriceRangeSection categorySlug={category} />

      <div className="max-w-7xl mx-auto px-4 w-full">
        <TopSellingNonAppleDevices categorySlug={category} />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <ShopByBrand categorySlug={category} />
      </div>

      <NotSureWhatToBuySection />
      <div className="max-w-7xl mx-auto px-4 w-full">
        <InstagramChatBanner />
      </div>

      <CategoryMegaDhamakaSection categorySlug={category} />
      <div className="max-w-7xl mx-auto px-4 w-full">
        <QualityGradeSection />
      </div>

      <ChoosingYourPathSection />

      <div className="max-w-7xl mx-auto px-4 w-full">
        <CertificationProcessSection />
      </div>

      <EMIOptionsSection />

      <HowToChooseSection />

      <VisitStoreSection />

      <CustomerReviewsSection />
      <BlogSection />
      <CategoryFAQSection categorySlug={category} />
      <PreownedIntroSection categorySlug={category} />
      <WhyBuyPreownedGrid categorySlug={category} />
      <CategorySeoContentSection categorySlug={category} />
      <BuyingGuideSection categorySlug={category} />
      <StatsSection categorySlug={category} />
      <PreownedQuoteBanner categorySlug={category} />
      <PreownedComparisonTable categorySlug={category} />
    </div>
  );
}
