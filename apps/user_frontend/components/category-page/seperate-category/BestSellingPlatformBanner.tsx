// components/category-page/seperate-category/BestSellingPlatformBanner.tsx
import Image from "next/image";
import Link from "next/link";

interface BannerConfig {
  src: string;
  alt: string;
  href: string;
}

interface CategoryBannerConfig {
  width: number;
  height: number;
  top: BannerConfig;
  bottom: BannerConfig;
}

const CATEGORY_BANNERS: Record<string, CategoryBannerConfig> = {
  "mobile-phone": {
    width: 1600,
    height: 507,
    top: {
      src: "/images/buy-category/mobiles/Android.png",
      alt: "Best Selling Android Phones",
      href: "/buy-used-mobile-phones?os=android",
    },
    bottom: {
      src: "/images/buy-category/mobiles/IOS.png",
      alt: "Best Selling Apple iPhones",
      href: "/buy-used-mobile-phones?os=ios",
    },
  },
  laptop: {
    width: 1600,
    height: 479,
    top: {
      src: "/images/buy-category/laptops/Windows.png",
      alt: "Best Selling Windows Laptops",
      href: "/buy-used-laptops?os=windows",
    },
    bottom: {
      src: "/images/buy-category/laptops/Macbook.png",
      alt: "Best Selling MacBooks",
      href: "/buy-used-laptops?os=macos",
    },
  },
  tablet: {
    width: 1600,
    height: 520,
    top: {
      src: "/images/buy-category/tablets/Android_Tablets.png",
      alt: "Best Selling Android Tablets",
      href: "/buy-used-tablets?os=android",
    },
    bottom: {
      src: "/images/buy-category/tablets/Ipads.png",
      alt: "Best Selling iPads",
      href: "/buy-used-tablets?os=ios",
    },
  },
  "smart-watch": {
    width: 1600,
    height: 520,
    top: {
      src: "/images/buy-category/smart-watches/Apple_Watches.png",
      alt: "Best Selling Apple Watches",
      href: "/buy-used-smartwatches?brand=apple",
    },
    bottom: {
      src: "/images/buy-category/smart-watches/Samsung_Watches.png",
      alt: "Best Selling Samsung Watches",
      href: "/buy-used-smartwatches?brand=samsung",
    },
  },
};

interface Props {
  categorySlug: string;
}

export function BestSellingPlatformBanner({ categorySlug }: Props) {
  const config = CATEGORY_BANNERS[categorySlug];

  if (!config) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-3 sm:gap-4">
      <Link
        href={config.top.href}
        className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden block"
      >
        <Image
          src={config.top.src}
          alt={config.top.alt}
          width={config.width}
          height={config.height}
          className="w-full h-auto"
          priority
        />
      </Link>

      <Link
        href={config.bottom.href}
        className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden block"
      >
        <Image
          src={config.bottom.src}
          alt={config.bottom.alt}
          width={config.width}
          height={config.height}
          className="w-full h-auto"
        />
      </Link>
    </div>
  );
}
