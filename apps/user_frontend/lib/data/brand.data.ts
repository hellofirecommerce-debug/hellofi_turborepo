import {
  GET_IN_STOCK_BRANDS,
  GET_BRANDS_BY_CATEGORY,
} from "../graphql/queires/brand.queries";

export interface Brand {
  id: string;
  name: string;
  seoName: string;
  image: string;
}
interface GetBrandsByCategoryData {
  getBrandsByCategorySeoName: Brand[];
}
interface GetInStockBrandsData {
  getInStockBrands: Brand[];
}

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

export async function getInStockBrands(
  categorySlug?: string,
): Promise<Brand[]> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_IN_STOCK_BRANDS.loc?.source.body,
        variables: { categorySlug },
      }),
      next: { revalidate: 300 },
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

export async function getBrandsByCategorySeoName(
  categorySeoName: string,
): Promise<Brand[]> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_BRANDS_BY_CATEGORY.loc?.source.body,
        variables: { categorySeoName },
      }),
      next: { revalidate: 86400 }, // 1 day
    });

    if (!res.ok) {
      console.error("getBrandsByCategorySeoName: HTTP error", res.status);
      return [];
    }

    const json: { data?: GetBrandsByCategoryData; errors?: unknown } =
      await res.json();

    if (json.errors) {
      console.error("getBrandsByCategorySeoName: GraphQL errors", json.errors);
      return [];
    }

    return json.data?.getBrandsByCategorySeoName ?? [];
  } catch (error) {
    console.error("getBrandsByCategorySeoName: fetch failed", error);
    return [];
  }
}
