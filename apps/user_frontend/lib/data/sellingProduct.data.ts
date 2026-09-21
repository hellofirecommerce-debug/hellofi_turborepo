import { GET_SELLING_PRODUCTS_BY_BRAND } from "../graphql/queires/sellingProduct.queries";

export interface SellingProductSeries {
  id: string;
  seriesName: string;
  priority: number;
}

export interface SellingProduct {
  id: string;
  productName: string;
  productSeoName: string;
  image: string;
  releasedYear: number | null;
  productPrice: number | null;
  series: SellingProductSeries;
}

interface SellingProductPage {
  items: SellingProduct[];
  hasMore: boolean;
}

interface GetSellingProductsData {
  getSellingProductsByBrand: SellingProductPage;
}

const GRAPHQL_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

export async function getSellingProductsByBrand(
  brandSeoName: string,
  categorySeoName: string,
  skip: number = 0,
  take: number = 10,
): Promise<SellingProductPage> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_SELLING_PRODUCTS_BY_BRAND.loc?.source.body,
        variables: { brandSeoName, categorySeoName, skip, take },
      }),
      // No revalidate cache — this is paginated, live data
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("getSellingProductsByBrand: HTTP error", res.status);
      return { items: [], hasMore: false };
    }

    const json: { data?: GetSellingProductsData; errors?: unknown } =
      await res.json();

    if (json.errors) {
      console.error("getSellingProductsByBrand: GraphQL errors", json.errors);
      return { items: [], hasMore: false };
    }

    return (
      json.data?.getSellingProductsByBrand ?? { items: [], hasMore: false }
    );
  } catch (error) {
    console.error("getSellingProductsByBrand: fetch failed", error);
    return { items: [], hasMore: false };
  }
}
