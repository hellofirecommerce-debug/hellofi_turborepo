import { GET_SERIES_BY_BRAND } from "../graphql/queires/series.queries";

export interface Series {
  id: string;
  seriesName: string;
  priority: number;
}

interface GetSeriesByBrandData {
  getSeriesByBrandSeoName: Series[];
}

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

export async function getSeriesByBrandSeoName(
  brandSeoName: string,
  categorySeoName?: string,
): Promise<Series[]> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_SERIES_BY_BRAND.loc?.source.body,
        variables: { brandSeoName, categorySeoName },
      }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error("getSeriesByBrandSeoName: HTTP error", res.status);
      return [];
    }

    const json: { data?: GetSeriesByBrandData; errors?: unknown } =
      await res.json();

    if (json.errors) {
      console.error("getSeriesByBrandSeoName: GraphQL errors", json.errors);
      return [];
    }

    return json.data?.getSeriesByBrandSeoName ?? [];
  } catch (error) {
    console.error("getSeriesByBrandSeoName: fetch failed", error);
    return [];
  }
}
