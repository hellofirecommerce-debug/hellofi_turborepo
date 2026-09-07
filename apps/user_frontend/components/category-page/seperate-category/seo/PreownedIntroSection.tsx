import { preownedIntroContent } from "../../../../lib/content/intro/preownedIntro";

interface Props {
  categorySlug: string;
}

export function PreownedIntroSection({ categorySlug }: Props) {
  const content = preownedIntroContent[categorySlug];

  if (!content) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black leading-tight mb-4 sm:mb-5 text-left">
        {content.title}
      </h1>

      <div className="flex flex-col gap-3 sm:gap-4">
        {content.paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="text-xs sm:text-sm text-gray-500 leading-relaxed text-justify w-full"
          >
            {paragraph}
          </p>
        ))}

        {content.summary && (
          <div>
            <h3 className="text-sm sm:text-base font-bold text-black mb-1.5">
              Summary
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed text-justify w-full">
              {content.summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
