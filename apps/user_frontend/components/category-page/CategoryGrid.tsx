// components/category-page/CategoryGrid.tsx
import Image from "next/image";
import Link from "next/link";

interface Category {
  title: string;
  image: string;
  href: string;
}

const CATEGORIES: Category[] = [
  {
    title: "Mobiles",
    image: "/images/buy-category/Mobile.PNG",
    href: "/buy-used-mobile-phones",
  },
  {
    title: "Laptops",
    image: "/images/buy-category/Laptop.PNG",
    href: "/buy-used-laptops",
  },
  {
    title: "Tablets",
    image: "/images/buy-category/Tablets.PNG",
    href: "/buy-used-tablets",
  },
  {
    title: "Smart Watches",
    image: "/images/buy-category/Smartwatch.PNG",
    href: "/buy-used-smartwatches",
  },
  {
    title: "Others",
    image: "/images/buy-category/Otheraccessories.PNG",
    href: "/buy-used-accessories",
  },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {CATEGORIES.map(({ title, image, href }) => (
        <Link
          key={title}
          href={href}
          className="relative block aspect-square w-full rounded-2xl overflow-hidden"
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </Link>
      ))}
    </div>
  );
}
