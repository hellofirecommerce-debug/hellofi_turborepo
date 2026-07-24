// components/category-page/mobile/MobilePriceRangeSection.tsx
import { PriceRangeGrid, type PriceRangeTile } from "../PriceRangeGrid";

const MOBILE_PRICE_TILES: PriceRangeTile[] = [
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
];

export function MobilePriceRangeSection() {
  return <PriceRangeGrid tiles={MOBILE_PRICE_TILES} />;
}
