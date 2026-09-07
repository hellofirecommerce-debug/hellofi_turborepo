// components/category-page/seperate-category/PreownedQuoteBanner.tsx

interface QuoteContent {
  title: string;
  intro: string;
  bulletsHeading?: string;
  bullets?: string[];
  extraHeading?: string;
  extraText?: string;
}

const QUOTE_CONTENT: Record<string, QuoteContent> = {
  "mobile-phone": {
    title: "Why Buy Preowned Instead of New?",
    intro:
      "Buying a preowned mobile phone is one of the smartest ways to access better hardware for less money. A two-year-old flagship phone, bought preowned, often outperforms a brand-new budget phone at the same price — better camera, faster processor, better display. With HelloFi's transparent grading, you get that value without the uncertainty that usually comes with buying second-hand.",
  },
  laptop: {
    title: "Why Buy Preowned Laptops/Apple MacBooks from HelloFi?",
    intro:
      "Laptops/Apple MacBooks are quality checked before listing. Brand Warranty or HelloFi 3 month service Warranty is included, unlike classifieds. Pricing is upfront with condition grading, no hidden issues. Condition history is more reliable.",
    bulletsHeading: "Top Reasons to Choose Secondhand Laptops?",
    bullets: [
      "Better specs per price.",
      "Faster access to premium brands.",
      "Lower risk if your needs change.",
      "Lower environmental impact.",
      "Easier to upgrade again later.",
    ],
    extraHeading: "Warranty, Returns and Delivery",
    extraText:
      "HelloFi backs preowned laptops with Brand or 3-month service warranty coverage and a return window if the device doesn't match expectations. Delivery timelines depend on location. In Bengaluru, HelloFi offers same day delivery within 5 km of its Koramangala office, so you can check and experience the device right at your doorstep before accepting it.",
  },
};

interface Props {
  categorySlug: string;
}

export function PreownedQuoteBanner({ categorySlug }: Props) {
  const content = QUOTE_CONTENT[categorySlug];

  if (!content) return null;

  return (
    <div className="w-full bg-[#003366]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center mb-4 sm:mb-5">
          {content.title}
        </h2>

        <p className="text-xs sm:text-sm text-white/90 text-justify leading-relaxed w-full">
          {content.intro}
        </p>

        {content.bulletsHeading && content.bullets && (
          <div className="mt-5 sm:mt-6">
            <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">
              {content.bulletsHeading}
            </h3>
            <ul className="flex flex-col gap-1.5 sm:gap-2">
              {content.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="text-xs sm:text-sm text-white/90 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.extraHeading && content.extraText && (
          <div className="mt-5 sm:mt-6">
            <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">
              {content.extraHeading}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 text-justify leading-relaxed w-full">
              {content.extraText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
