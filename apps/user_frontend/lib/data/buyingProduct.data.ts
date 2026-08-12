// lib/data/buyingProduct.data.ts
import { GET_BUYING_PRODUCTS_BY_SECTION } from "../graphql/queires/buyingProduct.queries";
import type {
  GetBuyingProductsBySectionData,
  GetBuyingProductsBySectionVars,
  BuyingProductSection,
} from "../types/buying/buyingProduct.types";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_URL!;

// ── Generic fetcher — used by every section-specific function below ──
async function fetchBySection(variables: GetBuyingProductsBySectionVars) {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_BUYING_PRODUCTS_BY_SECTION.loc?.source.body,
        variables,
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(
        `fetchBySection [${variables.section}]: HTTP error`,
        res.status,
      );
      return [];
    }

    const json: { data?: GetBuyingProductsBySectionData; errors?: unknown } =
      await res.json();

    if (json.errors) {
      console.error(
        `fetchBySection [${variables.section}]: GraphQL errors`,
        json.errors,
      );
      return [];
    }

    return json.data?.getBuyingProductsBySection ?? [];
  } catch (error) {
    console.error(`fetchBySection [${variables.section}]: fetch failed`, error);
    return [];
  }
}

// ── One exported function per section ──

export async function getMostLovedProducts(categorySlug?: string) {
  return fetchBySection({ section: "MOST_LOVED", categorySlug });
}

export async function getTopSellingProducts(categorySlug?: string) {
  return fetchBySection({ section: "TOP_SELLING", categorySlug });
}

export async function getTopSellingAppleProducts(categorySlug?: string) {
  return fetchBySection({ section: "TOP_SELLING_APPLE", categorySlug });
}

export async function getTopSellingNonAppleProducts(categorySlug?: string) {
  return fetchBySection({ section: "TOP_SELLING_NON_APPLE", categorySlug });
}

export async function getGamingLaptops(categorySlug?: string) {
  return fetchBySection({ section: "GAMING_LAPTOPS", categorySlug });
}

export async function getTrendingProducts(categorySlug?: string) {
  return fetchBySection({ section: "TRENDING", categorySlug });
}

export async function getPeopleLoveProducts(categorySlug?: string) {
  return fetchBySection({ section: "PEOPLE_LOVE", categorySlug });
}

export async function getMegaDhamakaProducts(categorySlug?: string) {
  return fetchBySection({ section: "MEGA_DHAMAKA", categorySlug });
}

export async function getLuxeProducts(categorySlug?: string) {
  return fetchBySection({ section: "LUXE", categorySlug });
}

// ── Generic fallback, in case you need a custom section not listed above ──
export async function getBuyingProductsBySection(
  variables: GetBuyingProductsBySectionVars,
) {
  return fetchBySection(variables);
}
