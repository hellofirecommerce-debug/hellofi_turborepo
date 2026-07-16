"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_ACTIVE_BANNER } from "../../lib/graphql/queires/banner.queries";

interface BannerProps {
  placement: string;
}

interface ActiveBannerData {
  activeBanner: {
    id: string;
    alt: string;
    lg: string;
    sm: string;
    redirectUrl: string | null;
    placement: string;
  } | null;
}

interface ActiveBannerVars {
  placement: string;
}

export function Banner({ placement }: BannerProps) {
  const { data, loading, error } = useQuery<ActiveBannerData, ActiveBannerVars>(
    GET_ACTIVE_BANNER,
    {
      variables: { placement },
    },
  );

  console.log("[Banner] render", {
    placement,
    loading,
    error: error?.message,
    data,
  });

  if (loading) {
    console.log("[Banner] still loading for placement:", placement);
    return null;
  }

  if (error) {
    console.error("[Banner] query error for placement:", placement, error);
    return null;
  }

  if (!data?.activeBanner) {
    console.warn(
      "[Banner] no active banner returned for placement:",
      placement,
    );
    return null;
  }

  const { alt, lg, sm, redirectUrl } = data.activeBanner;

  console.log("[Banner] rendering with URLs:", {
    cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
    lgFullUrl: `${process.env.NEXT_PUBLIC_CDN_URL}/${lg}`,
    smFullUrl: `${process.env.NEXT_PUBLIC_CDN_URL}/${sm}`,
  });

  const content = (
    <>
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${sm}`}
        alt={alt}
        width={800}
        height={400}
        className="block sm:hidden w-full h-[200px] object-contain rounded-2xl"
        priority
      />
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${lg}`}
        alt={alt}
        width={1600}
        height={300}
        className="hidden sm:block w-full h-[400px] rounded-2xl"
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
