import { Banner } from "../shared/Banner";
import { TrustBadgeStrip } from "../TrustBadgeStrip";
import { CategoryGrid } from "../shared/CategoryGrid";
import { MostLovedSection } from "../MostLovedSection";
import { ShopByBudget } from "../ShopByBudget";
import { PhonesPeopleLoveSection } from "../PhonesPeopleLoveSection";
import { ShopByBrand } from "../ShopByBrand";
import { TopSellingLaptopsSection } from "../TopSellingLaptopsSection";
import { LaptopDealsSection } from "../LaptopDealsSection";
import { QualityGradeSection } from "../QualityGradeSection";
import { CertificationProcessSection } from "../CertificationProcessSection";
import { TabletsIpadSection } from "../TabletsIpadSection";
import { PremiumLuxSection } from "../PremiumLuxSection";
import { LatestSmartwatchesSection } from "../LatestSmartwatchesSection";
import { EMIOptionsSection } from "../EMIOptionsSection";
import { OtherGadgetsSection } from "../OtherGadgetsSection";
import { CustomerReviewsSection } from "../CustomerReviewsSection";
import { BlogSection } from "../BlogSection";
import { PreownedFAQSection } from "../PreownedFAQSection";
import { CertifiedPreownedSection } from "../CertifiedPreownedSection";
import { KeyFeaturesSection } from "../KeyFeaturesSection";

interface Props {
  placement: string;
  categorySlug?: string;
}

export function BuyGadgetsPage({ placement, categorySlug }: Props) {
  return (
    <div className="min-h-dvh flex flex-col gap-6 py-10">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <Banner placement={placement} />
      </div>
      <div className="max-w-7xl mx-auto px-4 w-full">
        <TrustBadgeStrip />
      </div>
      <div className="max-w-7xl mx-auto px-4 w-full">
        <CategoryGrid />
      </div>
      <div className="max-w-7xl mx-auto px-4 w-full">
        <MostLovedSection categorySlug={categorySlug} />
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
      <PremiumLuxSection />
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
