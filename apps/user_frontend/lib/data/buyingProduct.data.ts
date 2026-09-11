// lib/data/buyingProduct.data.ts
import {
  GET_BUYING_PRODUCTS_BY_SECTION,
  GET_AVAILABLE_FILTERS,
  GET_FILTERED_BUYING_PRODUCTS,
} from "../graphql/queires/buyingProduct.queries";

import type {
  GetBuyingProductsBySectionData,
  GetBuyingProductsBySectionVars,
  BuyingProductSection,
} from "../types/buying/buyingProduct.types";

export interface AvailableFilters {
  categories: { id: string; name: string; seoName: string }[];
  storages: string[];
  rams: string[];
  conditions: string[];
  osList: string[];
  screenSizes: string[];
  processors: string[];
  batteryCapacities: string[];
  warrantyTypes: string[];
  brands: { id: string | null; name: string }[];
  priceRange: { min: number | null; max: number | null };
}

interface GetAvailableFiltersData {
  getAvailableFilters: AvailableFilters;
}

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

export async function getAvailableFilters(
  categorySlugs?: string[],
): Promise<AvailableFilters | null> {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_AVAILABLE_FILTERS.loc?.source.body,
        variables: { categorySlugs: categorySlugs ?? null },
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("getAvailableFilters: HTTP error", res.status);
      return null;
    }

    const json: { data?: GetAvailableFiltersData; errors?: unknown } =
      await res.json();

    if (json.errors) {
      console.error("getAvailableFilters: GraphQL errors", json.errors);
      return null;
    }

    return json.data?.getAvailableFilters ?? null;
  } catch (error) {
    console.error("getAvailableFilters: fetch failed", error);
    return null;
  }
}

export async function getFilteredBuyingProducts(filter: any) {
  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_FILTERED_BUYING_PRODUCTS.loc?.source.body,
        variables: { filter },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("getFilteredBuyingProducts: HTTP error", res.status);
      return { items: [], nextCursor: null, hasMore: false };
    }

    const json = await res.json();

    if (json.errors) {
      console.error("getFilteredBuyingProducts: GraphQL errors", json.errors);
      return { items: [], nextCursor: null, hasMore: false };
    }

    return (
      json.data?.getFilteredBuyingProducts ?? {
        items: [],
        nextCursor: null,
        hasMore: false,
      }
    );
  } catch (error) {
    console.error("getFilteredBuyingProducts: fetch failed", error);
    return { items: [], nextCursor: null, hasMore: false };
  }
}

export async function getFilteredBuyingProductsClient(filter: any) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_FILTERED_BUYING_PRODUCTS.loc?.source.body,
        variables: { filter },
      }),
    });
    const json = await res.json();
    return (
      json.data?.getFilteredBuyingProducts ?? {
        items: [],
        nextCursor: null,
        hasMore: false,
      }
    );
  } catch (error) {
    console.error("getFilteredBuyingProductsClient: fetch failed", error);
    return { items: [], nextCursor: null, hasMore: false };
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
