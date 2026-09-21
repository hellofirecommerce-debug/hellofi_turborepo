// components/sell-category-page/SellSEOContent.tsx
import { sellSEOContent } from "../../lib/content/sell-seo/sell-seo";

interface Props {
  categorySlug: string;
}

export function SellSEOContent({ categorySlug }: Props) {
  const content = sellSEOContent[categorySlug];

  if (!content) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {/* Intro */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {content.heading}
        </h2>

        {content.introParagraphs.map((para, i) => (
          <p
            key={i}
            className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed"
          >
            {para}
          </p>
        ))}

        {/* Resale value factors */}
        {content.resaleFactors && content.resaleFactors.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {content.resaleFactorsHeading}
            </h3>
            {content.resaleFactorsSubtext && (
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                {content.resaleFactorsSubtext}
              </p>
            )}

            <ol className="mt-5 flex flex-col gap-3">
              {content.resaleFactors.map((factor, i) => (
                <li key={factor.title} className="flex gap-2.5">
                  <span className="shrink-0 text-sm font-semibold text-gray-900">
                    {i + 1}.
                  </span>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      {factor.title}
                    </span>{" "}
                    {factor.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Sell in your city */}
        {content.cityAvailability && (
          <div className="mt-10 sm:mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {content.cityAvailability.heading}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {content.cityAvailability.body}
            </p>
          </div>
        )}

        {/* Trust / safety section */}
        {content.trustSection && (
          <div className="mt-10 sm:mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {content.trustSection.heading}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {content.trustSection.intro}
            </p>

            <div className="mt-5 flex flex-col gap-4">
              {content.trustSection.points.map((point) => (
                <p
                  key={point.title}
                  className="text-sm sm:text-base text-gray-600 leading-relaxed"
                >
                  <span className="font-semibold text-gray-900">
                    {point.title}
                  </span>{" "}
                  {point.body}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* About HelloFi */}
        {content.aboutHelloFi && (
          <div className="mt-10 sm:mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">
                About HelloFi:
              </span>{" "}
              {content.aboutHelloFi}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
