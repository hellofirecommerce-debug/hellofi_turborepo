// components/sell-category-page/SellPopularBrands.tsx
import Image from "next/image";
import Link from "next/link";
import { getBrandsByCategorySeoName } from "../../lib/data/brand.data";

interface Props {
  categorySlug: string;
}

export async function SellPopularBrands({ categorySlug }: Props) {
  const brands = await getBrandsByCategorySeoName(categorySlug);

  if (!brands.length) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs sm:text-sm font-bold text-[#0066FF] uppercase tracking-wide mb-6">
          Or select from popular brands
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/sell/${categorySlug}/${brand.seoName}`}
              className="flex items-center justify-center h-20 sm:h-24 rounded-xl border border-gray-200 hover:border-[#0066FF] transition-colors p-3"
            >
              <div className="relative w-full h-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${brand.image}`}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-700 mb-4">
            Don&apos;t see your brand? Don&apos;t Worry we accept 70+ models.
          </p>
          <Link
            href={`/sell/${categorySlug}/other-brand`}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#0066FF] text-white text-sm font-semibold hover:bg-[#0052cc] transition-colors"
          >
            Click Here to get Price for Other Company device
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
