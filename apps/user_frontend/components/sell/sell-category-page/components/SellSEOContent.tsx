// components/sell-category-page/SellSEOContent.tsx
import { CheckCircle2 } from "lucide-react";
import { sellSEOContent } from "../../../../lib/content/sell-seo/sell-seo";

interface Props {
  categorySlug: string;
}

export function SellSEOContent({ categorySlug }: Props) {
  const content = sellSEOContent[categorySlug];

  if (!content) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
        {/* Intro */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          {content.heading}
        </h2>
        <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-[#0066FF] to-[#38BDF8]" />

        {content.introParagraphs.map((para, i) => (
          <p
            key={i}
            className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed"
          >
            {para}
          </p>
        ))}

        {/* Resale value factors */}
        {content.resaleFactors && content.resaleFactors.length > 0 && (
          <div className="mt-12 sm:mt-14">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {content.resaleFactorsHeading}
            </h3>
            {content.resaleFactorsSubtext && (
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                {content.resaleFactorsSubtext}
              </p>
            )}

            <ol className="mt-6 flex flex-col gap-3">
              {content.resaleFactors.map((factor, i) => (
                <li
                  key={factor.title}
                  className="flex gap-3.5 rounded-2xl border border-gray-100 bg-[#F8FAFF] p-4 transition-colors hover:border-[#0066FF]/30 hover:bg-[#F1F6FF]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0066FF]/10 text-xs font-bold text-[#0066FF]">
                    {i + 1}
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
          <div className="mt-12 sm:mt-14 rounded-2xl bg-[#F4F7FF] p-6 ring-1 ring-blue-100 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {content.cityAvailability.heading}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {content.cityAvailability.body}
            </p>
          </div>
        )}

        {/* Trust / safety section */}
        {content.trustSection && (
          <div className="mt-12 sm:mt-14">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {content.trustSection.heading}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {content.trustSection.intro}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {content.trustSection.points.map((point) => (
                <div
                  key={point.title}
                  className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      {point.title}
                    </span>{" "}
                    {point.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About HelloFi */}
        {content.aboutHelloFi && (
          <div className="mt-12 sm:mt-14 rounded-2xl bg-gradient-to-br from-[#0052D4] via-[#0066FF] to-[#4B8BFF] p-6 text-white shadow-xl shadow-blue-500/20 sm:p-8">
            <p className="text-sm sm:text-base leading-relaxed text-blue-50">
              <span className="font-bold text-white">About HelloFi:</span>{" "}
              {content.aboutHelloFi}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
