import Image from "next/image";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Watch,
  Headphones,
} from "lucide-react";
import { Button } from "@repo/ui";
import { Grid3X3 } from "lucide-react";

const CATEGORIES = [
  { label: "Mobiles", icon: Smartphone, href: "/sell/mobiles" },
  { label: "Laptops", icon: Laptop, href: "/sell/laptops" },
  { label: "MacBook", icon: Monitor, href: "/sell/macbook" },
  { label: "Tablets", icon: Tablet, href: "/sell/tablets" },
  { label: "Smartwatches", icon: Watch, href: "/sell/smartwatches" },
  { label: "Other Gadgets", icon: Headphones, href: "/sell/other" },
];

export function SellSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1a1a2e] mb-2">
            What Are You Selling Today?
          </h2>
          <p className="text-sm text-gray-500 max-w-lg">
            Get the Best Price for Your Old & Used Electronics with Same-Day
            Free Doorstep Pickup. No Hidden Charges, No Hassle, No Last Minute
            Negotiations and No Third Party Pickup Executives Just a Smooth,
            Transparent, and Trusted Experience.
          </p>
        </div>
        <div className="hidden lg:block flex-shrink-0">
          <Button
            asChild
            variant="default"
            size="lg"
            style={{ color: "#ffffff" }}
            className="rounded-full bg-primary hover:bg-primary-hover w-full"
          >
            <Link href="/sell">START SELLING</Link>
          </Button>
        </div>
      </div>

      {/* 60-40 split */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
        {/* Left — 60% */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4 flex items-center gap-2">
            <span className="w-4 h-4  rounded-sm inline-flex items-center justify-center">
              <span className="text-primary text-[8px]">
                <Grid3X3 />
              </span>
            </span>
            Sell by Product
          </p>
          {/* 2 cols on mobile, 3 cols on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
            {CATEGORIES.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center justify-center gap-2 border-2 border-gray-200 rounded-2xl py-6 px-3 hover:border-primary hover:bg-primary-surface transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-primary-surface flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Icon
                    size={20}
                    className="text-primary group-hover:text-white transition-colors"
                  />
                </div>
                <span className="text-xs font-semibold text-black text-center">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right — 40%, desktop only */}
        <div className="hidden lg:flex flex-col gap-3 w-full lg:w-[40%]">
          <div className="rounded-2xl overflow-hidden relative flex-1 min-h-0">
            <Image
              src="/images/sell/sell-macbook.png"
              alt="MacBook"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-3 h-[130px] flex-shrink-0">
            <div className="flex-1 rounded-2xl overflow-hidden relative">
              <Image
                src="/images/sell/sell-smartwatch.jpg"
                alt="Smartwatch"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative">
              <Image
                src="/images/sell/sell-earbuds.jpg"
                alt="Earbuds"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile start selling button */}
      <div className="lg:hidden mt-6">
        <Button
          asChild
          variant="default"
          size="lg"
          style={{ color: "#ffffff" }}
          className="rounded-full bg-primary hover:bg-primary-hover w-full"
        >
          <Link href="/sell">Start Selling</Link>
        </Button>
      </div>
    </section>
  );
}
