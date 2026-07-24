// components/category-page/shared/PriceRangeGrid.tsx
import Image from "next/image";
import Link from "next/link";

export interface PriceRangeTile {
  image: string;
  href: string;
}

interface PriceRangeGridProps {
  tiles: PriceRangeTile[];
}

export function PriceRangeGrid({ tiles }: PriceRangeGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {tiles.map(({ image, href }) => (
          <Link
            key={image}
            href={href}
            className="relative block rounded-xl sm:rounded-2xl overflow-hidden border border-card-border aspect-[760/391]"
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
