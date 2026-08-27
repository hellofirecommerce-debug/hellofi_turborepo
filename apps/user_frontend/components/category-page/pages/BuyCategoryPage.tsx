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
import { MobilePriceRangeSection } from "../seperate-category/mobiles/MobilePriceRangeSection";
import { TopSellingNonAppleDevices } from "../seperate-category/TopSellingNonAppleDevices";
import { BrandLogoStrip } from "../seperate-category/BrandLogoStrip";
import { NotSureWhatToBuySection } from "../seperate-category/mobiles/NotSureWhatToBuySection";
import { InstagramChatBanner } from "../seperate-category/InstagramChatBanner";

import { CategoryMegaDhamakaSection } from "../seperate-category/CategoryMegaDhamakaSection";
import { ChoosingYourPathSection } from "../seperate-category/mobiles/ChoosingYourPathSection";
import { HowToChooseSection } from "../shared/HowToChooseSection";
import { VisitStoreSection } from "../shared/VisitStoreSection";
import { MobileFAQSection } from "../seperate-category/mobiles/MobileFAQSection";
import { PreownedIntroSection } from "../seperate-category/mobiles/PreownedIntroSection";
import { WhyBuyPreownedGrid } from "../seperate-category/mobiles/WhyBuyPreownedGrid";
import { PreownedQuoteBanner } from "../seperate-category/mobiles/PreownedQuoteBanner";
import { PreownedComparisonTable } from "../seperate-category/mobiles/PreownedComparisonTable";

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

      <MobilePriceRangeSection />

      <div className="max-w-7xl mx-auto px-4 w-full">
        <TopSellingNonAppleDevices categorySlug={category} />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <ShopByBrand categorySlug={category} />
      </div>

      {/* <NotSureWhatToBuySection /> */}
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
      <MobileFAQSection />
      <PreownedIntroSection />
      <WhyBuyPreownedGrid />
      <PreownedQuoteBanner />
      <PreownedComparisonTable />
    </div>
  );
}
