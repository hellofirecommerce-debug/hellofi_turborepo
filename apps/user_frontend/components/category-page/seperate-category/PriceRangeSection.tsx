// components/category-page/seperate-category/PriceRangeSection.tsx
import { PriceRangeGrid, type PriceRangeTile } from "./PriceRangeGrid";

const PRICE_TILES: Record<string, PriceRangeTile[]> = {
  "mobile-phone": [
    {
      image: "/images/buy-category/mobiles/under-15000.png",
      href: "/buy-used-mobile-phones?max=15000",
    },
    {
      image: "/images/buy-category/mobiles/under-30000.png",
      href: "/buy-used-mobile-phones?max=30000",
    },
    {
      image: "/images/buy-category/mobiles/under-50000.png",
      href: "/buy-used-mobile-phones?max=50000",
    },
    {
      image: "/images/buy-category/mobiles/above-50000.png",
      href: "/buy-used-mobile-phones?min=50000",
    },
  ],
  laptop: [
    {
      image: "/images/buy-category/laptops/laptop_under_20000.PNG",
      href: "/buy-used-laptops?max=20000",
    },
    {
      image: "/images/buy-category/laptops/laptop_under_40000.PNG",
      href: "/buy-used-laptops?max=40000",
    },
    {
      image: "/images/buy-category/laptops/laptop_under_70000.PNG",
      href: "/buy-used-laptops?max=70000",
    },
    {
      image: "/images/buy-category/laptops/laptop_over_70000.PNG",
      href: "/buy-used-laptops?min=70000",
    },
  ],
  tablet: [
    {
      image: "/images/buy-category/tablets/Tablets_Under_20000.PNG",
      href: "/buy-used-tablets?max=20000",
    },
    {
      image: "/images/buy-category/tablets/Tablets_Under_40000.PNG",
      href: "/buy-used-tablets?max=40000",
    },
    {
      image: "/images/buy-category/tablets/Tablets_Under-70000.PNG",
      href: "/buy-used-tablets?max=70000",
    },
    {
      image: "/images/buy-category/tablets/Tablets_Above_70000.PNG",
      href: "/buy-used-tablets?min=70000",
    },
  ],
  "smart-watch": [
    {
      image: "/images/buy-category/smart-watches/Smart_Watches_Under_10000.PNG",
      href: "/buy-used-smartwatches?max=10000",
    },
    {
      image: "/images/buy-category/smart-watches/Smart_Watches_Under_20000.PNG",
      href: "/buy-used-smartwatches?max=20000",
    },
    {
      image: "/images/buy-category/smart-watches/Smart_Watches_Under_30000.PNG",
      href: "/buy-used-smartwatches?max=30000",
    },
    {
      image: "/images/buy-category/smart-watches/Smart_Watches_Above_30000.PNG",
      href: "/buy-used-smartwatches?min=30000",
    },
  ],
};

interface Props {
  categorySlug: string;
}

export function PriceRangeSection({ categorySlug }: Props) {
  const tiles = PRICE_TILES[categorySlug];

  if (!tiles) return null;

  return <PriceRangeGrid tiles={tiles} />;
}
