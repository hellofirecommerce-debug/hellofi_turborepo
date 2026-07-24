// components/category-page/shared/InstagramChatBanner.tsx
import Image from "next/image";

export function InstagramChatBanner() {
  return (
    <div className="relative w-full h-[140px] sm:h-[200px] lg:h-auto lg:aspect-[1414/591] rounded-xl sm:rounded-2xl overflow-hidden">
      <Image
        src="/images/buy-category/shared/insta_chat.png"
        alt="Follow us on Instagram and Chat with an Expert"
        fill
        className="object-cover lg:object-contain"
        sizes="(max-width: 1024px) 100vw, 1200px"
        priority
      />
    </div>
  );
}
