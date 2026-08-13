// lib/data/brand.data.ts
import { GET_IN_STOCK_BRANDS } from "../graphql/queires/brand.queries";

export interface Brand {
  id: string;
  name: string;
  seoName: string;
  image: string;
}

interface GetInStockBrandsData {
  getInStockBrands: Brand[];
}

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

export async function getInStockBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_IN_STOCK_BRANDS.loc?.source.body,
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("getInStockBrands: HTTP error", res.status);
      return [];
    }

    const json: { data?: GetInStockBrandsData; errors?: unknown } =
      await res.json();

    if (json.errors) {
      console.error("getInStockBrands: GraphQL errors", json.errors);
      return [];
    }

    return json.data?.getInStockBrands ?? [];
  } catch (error) {
    console.error("getInStockBrands: fetch failed", error);
    return [];
  }
}
