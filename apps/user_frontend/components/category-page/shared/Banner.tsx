// components/category-page/shared/Banner.tsx
import Image from "next/image";
import Link from "next/link";
import { getActiveBanner } from "../../../lib/data/banner.data";

interface BannerProps {
  placement: string;
}

export async function Banner({ placement }: BannerProps) {
  const banner = await getActiveBanner(placement);

  if (!banner) return null;

  const { alt, lg, sm, redirectUrl } = banner;

  const content = (
    <>
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${sm}`}
        alt={alt}
        width={720}
        height={360}
        className="block sm:hidden w-full h-auto rounded-2xl"
        priority
      />
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${lg}`}
        alt={alt}
        width={1280}
        height={400}
        className="hidden sm:block w-full h-auto rounded-2xl"
        priority
      />
    </>
  );

  if (redirectUrl) {
    return (
      <Link href={redirectUrl} className="block w-full">
        {content}
      </Link>
    );
  }

  return <div className="w-full">{content}</div>;
}
