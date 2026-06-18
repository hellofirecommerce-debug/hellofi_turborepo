import { HeroSection } from "../components/home/HeroSection";
import { StatsBar } from "../components/home/StatsBar";
import { TrendingSection } from "../components/home/TrendingSection";
import { SellSection } from "../components/home/SellSection";
import { StepsToSell } from "../components/home/StepsToSell";
import { CitiesSection } from "../components/home/CitiesSection";
import { PremiumSection } from "../components/home/PremiumSection";
import { WhyHelloFiSection } from "../components/home/WhyHellofiSection";
import { StoriesAndReviewsSection } from "../components/home/StoriesAndReviewsSection";
import { FAQSection } from "../components/home/FAQSection";
import { SEOContentSection } from "../components/home/SEOContentSection";
import { fetchHomeVideoStories } from "../lib/data/video-reviews";

export default async function HomePage() {
  const stories = await fetchHomeVideoStories();

  return (
    <main className="pb-20 lg:pb-0">
      <HeroSection />
      <StatsBar />
      <TrendingSection />
      <SellSection />
      <StepsToSell />
      <CitiesSection />
      <PremiumSection />
      <WhyHelloFiSection />
      <StoriesAndReviewsSection stories={stories} />
      <FAQSection />
      <SEOContentSection />
    </main>
  );
}
