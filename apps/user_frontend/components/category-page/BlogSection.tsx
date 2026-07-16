// components/category-page/BlogSection.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    category: "Buying Guide",
    readTime: "5 min read",
    title:
      "iPhone 13 vs iPhone 14: Is the Upgrade Worth it at Preowned Prices?",
    excerpt:
      "When both are available certified preowned, the price gap narrows dramatically. We break down camera, battery, and chip difference to help you decide.",
    image: "iphone-13-vs-14-comparison",
    href: "/blog/iphone-13-vs-14-preowned",
  },
  {
    category: "Tips & Tricks",
    readTime: "3 min read",
    title: "How to Check iCloud Status Before Buying Any Preowned iPhone",
    excerpt:
      "One MCI check can save you ₹50,000 mistake. Here's the exact process we use on HelloFi — and how you can do it yourself in 60 seconds.",
    image: "icloud-status-check-guide",
    href: "/blog/check-icloud-status-preowned-iphone",
  },
];

export function BlogSection() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-8 sm:py-10 lg:py-14">
      <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-primary mb-1.5">
            Learn Before You Buy
          </p>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
            From the HelloFi Blog
          </h2>
        </div>

        <Link
          href="/blog"
          className="shrink-0 flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:underline whitespace-nowrap mt-1"
        >
          View all articles →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {BLOG_POSTS.map(
          ({ category, readTime, title, excerpt, image, href }) => (
            <Link
              key={href}
              href={href}
              className="block bg-white border border-card-border rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-transform"
            >
              <div className="relative aspect-[16/10] bg-gray-200 flex items-center justify-center">
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium px-3 text-center">
                  {image}
                </span>
              </div>

              <div className="p-3.5 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] sm:text-[10px] font-semibold text-primary bg-primary-surface px-2 py-1 rounded-full">
                    {category}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">
                    {readTime}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-black leading-snug mb-1.5 sm:mb-2">
                  {title}
                </h3>

                <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mb-2.5 sm:mb-3">
                  {excerpt}
                </p>

                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-primary">
                  Read article
                  <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
