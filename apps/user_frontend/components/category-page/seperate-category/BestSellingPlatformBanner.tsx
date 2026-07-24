// components/category-page/mobile/BestSellingPlatformBanner.tsx
import Image from "next/image";
import Link from "next/link";

interface BestSellingPlatformBannerProps {
  androidHref?: string;
  appleHref?: string;
}

export function BestSellingPlatformBanner({
  androidHref = "/buy-used-mobile-phones?os=android",
  appleHref = "/buy-used-mobile-phones?os=ios",
}: BestSellingPlatformBannerProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      {/* combined banner image with two clickable zones */}
      <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden">
        <Image
          src="/images/buy-category/mobiles/Android_IOS.png"
          alt="Best Selling Android Phone and Apple iPhone"
          width={1836}
          height={856}
          className="w-full h-auto"
          priority
        />

        {/* top ~51% — Android section, clickable */}
        <Link
          href={androidHref}
          aria-label="Shop best selling Android phones"
          className="absolute top-0 left-0 w-full"
          style={{ height: "51.4%" }}
        />

        {/* bottom ~49% — Apple section, clickable */}
        <Link
          href={appleHref}
          aria-label="Shop best selling Apple iPhones"
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "48.6%" }}
        />
      </div>
    </div>
  );
}
