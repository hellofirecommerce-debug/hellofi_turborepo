// components/sell-category-page/SellPopularBrands.tsx
import Image from "next/image";
import Link from "next/link";
import { getBrandsByCategorySeoName } from "../../../../lib/data/brand.data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

interface Props {
  categorySlug: string;
}

export async function SellPopularBrands({ categorySlug }: Props) {
  const brands = await getBrandsByCategorySeoName(categorySlug);

  if (!brands.length) return null;

  return (
    <section className="w-full py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-200" />
            <p className="text-xs sm:text-sm font-bold text-[#0066FF] uppercase tracking-widest text-center">
              Or select from popular brands
            </p>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-200" />
          </div>
        </Reveal>

        <RevealGroup
          stagger={0.05}
          className="mt-8 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4"
        >
          {brands.map((brand) => (
            <RevealItem key={brand.id} y={20}>
              <Link
                href={`/sell-old-${categorySlug}/${brand.seoName}`}
                className="group flex h-20 sm:h-24 items-center justify-center rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0066FF]/60 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${brand.image}`}
                    alt={brand.name}
                    fill
                    className="object-contain grayscale-[40%] transition duration-300 group-hover:scale-110 group-hover:grayscale-0"
                    sizes="120px"
                  />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-10 text-center">
          <p className="text-sm text-gray-700 mb-4">
            Don&apos;t see your brand? Don&apos;t Worry we accept{" "}
            <span className="font-bold text-[#0066FF]">70+ models</span>.
          </p>
          <Link
            href={`/sell-old-${categorySlug}/other-brand`}
            className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#3B82F6] text-white text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
          >
            Click Here to get Price for Other Company device
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
