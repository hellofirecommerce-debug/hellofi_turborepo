// components/category-page/CustomerReviewsSection.tsx
import { Star, BadgeCheck } from "lucide-react";

interface Review {
  name: string;
  location: string;
  rating: number;
  timeAgo: string;
  text: string;
  purchased: string;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    name: "Rohan Mehta",
    location: "Mumbai",
    rating: 5,
    timeAgo: "2 weeks ago",
    text: "Honestly surprised. The phone looked brand new, battery health was 93% exactly as listed. iCloud was cleared, setup was instant. HelloFi's packaging was solid too — arrived without a scratch.",
    purchased: "iPhone 13 128GB",
    verified: true,
  },
  {
    name: "Priya Nair",
    location: "Bengaluru",
    rating: 5,
    timeAgo: "1 month ago",
    text: "Bought a MacBook Air M1 for my design work. Condition matched perfectly, a tiny scuff on the lid (mentioned in the listing) but performance is flawless. Saved ₹30,000 vs buying new.",
    purchased: "MacBook Air M1",
    verified: true,
  },
  {
    name: "Arjun Singh",
    location: "Delhi",
    rating: 5,
    timeAgo: "3 weeks ago",
    text: "Tried buying from HelloFi with a lot of hesitation, excellent experience every time. The 5-day return policy gives real peace of mind. This time got a Galaxy S23 exactly as described, zero issues.",
    purchased: "Samsung Galaxy S23",
    verified: true,
  },
];

export function CustomerReviewsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10 lg:py-14">
      <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-primary mb-1.5 sm:mb-2">
            Real Buyers, Real Experiences, Trusted by Customers
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
            Customer Reviews
          </h2>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
            4.8<span className="text-sm sm:text-base text-gray-400">/5</span>
          </p>
          <div className="flex gap-0.5 justify-end my-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-400">
            Based on 500+ Google Reviews
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {REVIEWS.map(
          ({ name, location, rating, timeAgo, text, purchased, verified }) => (
            <div
              key={name}
              className="bg-white border border-card-border rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-surface flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold text-primary">
                    {name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-black leading-tight truncate">
                    {name}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 leading-tight">
                    {location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-400">
                  {timeAgo}
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed flex-1">
                {text}
              </p>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-card-border">
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-gray-400">
                    Purchased:
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-black truncate">
                    {purchased}
                  </p>
                </div>
                {verified && (
                  <span className="shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-success">
                    <BadgeCheck size={12} />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
