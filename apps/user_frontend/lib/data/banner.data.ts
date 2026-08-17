// lib/data/banner.data.ts
import { GET_ACTIVE_BANNER } from "../graphql/queires/banner.queries";

export interface ActiveBanner {
  id: string;
  alt: string;
  lg: string;
  sm: string;
  redirectUrl: string | null;
  placement: string;
}

interface ActiveBannerData {
  activeBanner: ActiveBanner | null;
}

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

export async function getActiveBanner(
  placement: string,
): Promise<ActiveBanner | null> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_ACTIVE_BANNER.loc?.source.body,
        variables: { placement },
      }),
      next: { revalidate: 86400 }, // 1 day
    });

    if (!res.ok) {
      console.error("getActiveBanner: HTTP error", res.status);
      return null;
    }

    const json: { data?: ActiveBannerData; errors?: unknown } =
      await res.json();

    if (json.errors) {
      console.error("getActiveBanner: GraphQL errors", json.errors);
      return null;
    }

    return json.data?.activeBanner ?? null;
  } catch (error) {
    console.error("getActiveBanner: fetch failed", error);
    return null;
  }
}
