import prisma from "@repo/db";
import {
  handleServiceError,
  throwNotFoundError,
  throwInputError,
} from "../../lib/utils/error";

const SECTION_LIMIT = 10;
const PER_CATEGORY_LIMIT = 2;
const EXCLUDED_CATEGORY_SLUGS = ["mac"];

export type BuyingProductSection =
  | "TOP_SELLING"
  | "TOP_SELLING_APPLE"
  | "TOP_SELLING_NON_APPLE"
  | "GAMING_LAPTOPS"
  | "TRENDING"
  | "MOST_LOVED"
  | "PEOPLE_LOVE"
  | "MEGA_DHAMAKA"
  | "LUXE";

const buyingProductInclude = {
  brand: true,
  category: true,
  variants: {
    where: { quantity: { gt: 0 } },
    orderBy: { price: "asc" as const },
    take: 1,
    include: {
      images: {
        where: { isDefault: true },
        orderBy: { priority: "asc" as const },
      },
    },
  },
};

function buildSectionWhere(section: BuyingProductSection) {
  switch (section) {
    case "TOP_SELLING":
      return { isTopSelling: true };
    case "TOP_SELLING_APPLE":
      return {
        isTopSelling: true,
        brand: { name: { equals: "Apple", mode: "insensitive" as const } },
      };
    case "TOP_SELLING_NON_APPLE":
      return {
        isTopSelling: true,
        NOT: {
          brand: { name: { equals: "Apple", mode: "insensitive" as const } },
        },
      };
    case "GAMING_LAPTOPS":
      return { isGaming: true };
    case "TRENDING":
      return { isTrending: true };
    case "MEGA_DHAMAKA":
      return { isMegaDhamaka: true };
    case "MOST_LOVED":
      return { featuredSection: "MOST_LOVED" };
    case "PEOPLE_LOVE":
      return { featuredSection: "PEOPLE_LOVE" };
    case "LUXE":
      return { isLuxe: true };
    default:
      throwInputError(`Unknown section: ${section}`);
      return {};
  }
}

function toCard(p: any) {
  const variant = p.variants[0]!;
  return {
    id: p.id,
    productName: p.productName,
    productSubtitle: p.productSubtitle,
    slug: p.slug,
    brandId: p.brandId,
    manualBrand: p.manualBrand,
    categoryId: p.categoryId,
    brand: p.brand,
    category: p.category,
    price: variant.price,
    mrp: variant.mrp,
    emiBasePrice: variant.emiBasePrice,
    condition: variant.condition,
    storage: variant.storage,
    warrantyType: variant.warrantyType,
    variantSku: variant.sku,
    image: variant.images[0] ?? null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

class UserBuyingProductService {
  async getBuyingProductsBySection(params: {
    section: BuyingProductSection;
    categorySlug?: string;
  }) {
    try {
      const { section, categorySlug } = params;
      const sectionWhere: any = buildSectionWhere(section);

      // ── Category scoped: single category, capped to SECTION_LIMIT ──
      if (categorySlug) {
        const category = await prisma.category.findUnique({
          where: { seoName: categorySlug },
        });
        if (!category || category.status !== "ACTIVE") {
          return throwNotFoundError("Category not found");
        }

        const products = await prisma.buyingProduct.findMany({
          where: {
            categoryId: category.id,
            ...sectionWhere,
            variants: { some: { quantity: { gt: 0 } } },
          },
          include: buyingProductInclude,
          orderBy: { createdAt: "desc" },
          take: SECTION_LIMIT,
        });

        return products.filter((p) => p.variants.length > 0).map(toCard);
      }

      // ── No category: PER_CATEGORY_LIMIT per active category (excluding EXCLUDED_CATEGORY_SLUGS),
      //     combined result capped to SECTION_LIMIT overall ──
      const categories = await prisma.category.findMany({
        where: {
          status: "ACTIVE",
          seoName: { notIn: EXCLUDED_CATEGORY_SLUGS },
        },
        select: { id: true },
      });

      const perCategoryResults = await Promise.all(
        categories.map((cat) =>
          prisma.buyingProduct.findMany({
            where: {
              categoryId: cat.id,
              ...sectionWhere,
              variants: { some: { quantity: { gt: 0 } } },
            },
            include: buyingProductInclude,
            orderBy: { createdAt: "desc" },
            take: PER_CATEGORY_LIMIT,
          }),
        ),
      );

      return perCategoryResults
        .flat()
        .filter((p) => p.variants.length > 0)
        .map(toCard)
        .slice(0, SECTION_LIMIT);
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getInStockBrandIds(categorySlug?: string): Promise<string[]> {
    try {
      let categoryId: string | undefined;

      if (categorySlug) {
        const category = await prisma.category.findUnique({
          where: { seoName: categorySlug },
        });
        if (!category) return [];
        categoryId = category.id;
      }

      const result = await prisma.buyingProduct.findMany({
        where: {
          ...(categoryId && { categoryId }),
          variants: {
            some: {
              quantity: { gt: 0 },
            },
          },
        },
        select: {
          brandId: true,
        },
        distinct: ["brandId"],
      });

      return result
        .map((r) => r.brandId)
        .filter((id): id is string => id !== null);
    } catch (error) {
      console.log("Error fetching in-stock brand ids:", error);
      throw error;
    }
  }

  async getAvailableFilters(categorySlugs?: string[]) {
    try {
      let categoryIds: string[] | undefined;

      if (categorySlugs && categorySlugs.length > 0) {
        const categories = await prisma.category.findMany({
          where: {
            seoName: { in: categorySlugs },
            status: "ACTIVE",
          },
        });
        if (categories.length === 0) {
          return throwNotFoundError("Category not found");
        }
        categoryIds = categories.map((c) => c.id);
      }

      const variantWhere: any = {
        quantity: { gt: 0 },
        ...(categoryIds && { product: { categoryId: { in: categoryIds } } }),
      };

      const productWhere: any = {
        ...(categoryIds && { categoryId: { in: categoryIds } }),
        variants: { some: { quantity: { gt: 0 } } },
      };

      const [
        storages,
        rams,
        conditions,
        osList,
        screenSizes,
        processors,
        batteryCapacities,
        warrantyTypes,
        priceAgg,
        brandedProducts,
        productsWithCategory,
      ] = await Promise.all([
        prisma.buyingVariant.findMany({
          where: { ...variantWhere, storage: { not: null } },
          distinct: ["storage"],
          select: { storage: true },
        }),
        prisma.buyingVariant.findMany({
          where: { ...variantWhere, ram: { not: null } },
          distinct: ["ram"],
          select: { ram: true },
        }),
        prisma.buyingVariant.findMany({
          where: variantWhere,
          distinct: ["condition"],
          select: { condition: true },
        }),
        prisma.buyingVariant.findMany({
          where: { ...variantWhere, os: { not: null } },
          distinct: ["os"],
          select: { os: true },
        }),
        prisma.buyingVariant.findMany({
          where: { ...variantWhere, screenSize: { not: null } },
          distinct: ["screenSize"],
          select: { screenSize: true },
        }),
        prisma.buyingVariant.findMany({
          where: { ...variantWhere, processor: { not: null } },
          distinct: ["processor"],
          select: { processor: true },
        }),
        prisma.buyingVariant.findMany({
          where: { ...variantWhere, batteryCapacity: { not: null } },
          distinct: ["batteryCapacity"],
          select: { batteryCapacity: true },
        }),
        prisma.buyingVariant.findMany({
          where: variantWhere,
          distinct: ["warrantyType"],
          select: { warrantyType: true },
        }),
        prisma.buyingVariant.aggregate({
          where: variantWhere,
          _min: { price: true },
          _max: { price: true },
        }),
        // ── Brand lives on BuyingProduct (relation or manualBrand text), not on the variant ──
        prisma.buyingProduct.findMany({
          where: productWhere,
          distinct: ["brandId", "manualBrand"],
          select: {
            brandId: true,
            manualBrand: true,
            brand: { select: { id: true, name: true } },
          },
        }),
        // ── Categories that actually have at least one in-stock product ──
        // Note: intentionally NOT scoped by categoryIds — this always reflects
        // every category with in-stock products, regardless of the current
        // filter selection, so the UI can still show/switch between categories.
        prisma.buyingProduct.findMany({
          where: { variants: { some: { quantity: { gt: 0 } } } },
          distinct: ["categoryId"],
          select: {
            category: { select: { id: true, name: true, seoName: true } },
          },
        }),
      ]);

      // ── Merge brand relation + manualBrand into one deduped {id, name} list ──
      const brandMap = new Map<string, { id: string | null; name: string }>();
      for (const p of brandedProducts) {
        if (p.brand) {
          brandMap.set(p.brand.id, { id: p.brand.id, name: p.brand.name });
        } else if (p.manualBrand) {
          brandMap.set(p.manualBrand, { id: null, name: p.manualBrand });
        }
      }

      const categories = productsWithCategory
        .map((p) => p.category)
        .filter(Boolean);

      return {
        categories,
        storages: storages.map((v) => v.storage).filter(Boolean),
        rams: rams.map((v) => v.ram).filter(Boolean),
        conditions: conditions.map((v) => v.condition),
        osList: osList.map((v) => v.os).filter(Boolean),
        screenSizes: screenSizes.map((v) => v.screenSize).filter(Boolean),
        processors: processors.map((v) => v.processor).filter(Boolean),
        batteryCapacities: batteryCapacities
          .map((v) => v.batteryCapacity)
          .filter(Boolean),
        warrantyTypes: warrantyTypes.map((v) => v.warrantyType),
        brands: Array.from(brandMap.values()),
        priceRange: {
          min: priceAgg._min.price?.toNumber() ?? null,
          max: priceAgg._max.price?.toNumber() ?? null,
        },
      };
    } catch (error) {
      console.error("Failed to fetch available filters:", error);
      throw error;
    }
  }

  async getFilteredBuyingProducts(filter: {
    categorySlugs?: string[];
    brands?: string[];
    storages?: string[];
    rams?: string[];
    battery?: string[];
    screenSizes?: string[];
    warrantyTypes?: string[];
    conditions?: string[];
    osList?: string[];
    priceMin?: number;
    priceMax?: number;
    sort?: "NEWEST" | "PRICE_ASC" | "PRICE_DESC";
    cursor?: string;
    limit?: number;
  }) {
    try {
      const limit = filter.limit ?? 10;
  
      let categoryIds: string[] | undefined;
      if (filter.categorySlugs && filter.categorySlugs.length > 0) {
        const categories = await prisma.category.findMany({
          where: { seoName: { in: filter.categorySlugs }, status: "ACTIVE" },
          select: { id: true },
        });
        categoryIds = categories.map((c) => c.id);
      }
  
      let brandCondition: any = undefined;
      if (filter.brands && filter.brands.length > 0) {
        brandCondition = {
          OR: [
            { brand: { name: { in: filter.brands, mode: "insensitive" } } },
            { manualBrand: { in: filter.brands, mode: "insensitive" } },
          ],
        };
      }
  
      const variantFilter: any = {
        quantity: { gt: 0 },
        ...(filter.storages?.length && { storage: { in: filter.storages } }),
        ...(filter.rams?.length && { ram: { in: filter.rams } }),
        ...(filter.battery?.length && { batteryCapacity: { in: filter.battery } }),
        ...(filter.screenSizes?.length && { screenSize: { in: filter.screenSizes } }),
        ...(filter.warrantyTypes?.length && {
          warrantyType: { in: filter.warrantyTypes as any },
        }),
        ...(filter.conditions?.length && { condition: { in: filter.conditions as any } }),
        ...(filter.osList?.length && { os: { in: filter.osList as any } }),
        ...((filter.priceMin !== undefined || filter.priceMax !== undefined) && {
          price: {
            ...(filter.priceMin !== undefined && { gte: filter.priceMin }),
            ...(filter.priceMax !== undefined && { lte: filter.priceMax }),
          },
        }),
      };
  
      const productWhere: any = {
        ...(categoryIds && { categoryId: { in: categoryIds } }),
        ...(brandCondition ?? {}),
        variants: { some: variantFilter },
      };
  
      // ── Sort order at DB level (price sort uses variant relation aggregation via a join,
      //     but Prisma doesn't support ordering a parent by a filtered child's field directly.
      //     Simplest robust approach: sort by createdAt for NEWEST, and for price sort,
      //     fetch a slightly larger window and sort in-memory per page. For fully correct
      //     global price sorting across all pages, use $queryRaw — flagged below. ──
      const orderBy: any = { createdAt: "desc" };
  
      const products = await prisma.buyingProduct.findMany({
        where: productWhere,
        include: {
          brand: true,
          category: true,
          variants: {
            where: variantFilter,
            orderBy: { price: "asc" },
            take: 1,
            include: {
              images: {
                where: { isDefault: true },
                orderBy: { priority: "asc" },
              },
            },
          },
        },
        orderBy,
        take: limit + 1, // fetch one extra to know if there's more
        ...(filter.cursor && {
          cursor: { id: filter.cursor },
          skip: 1, // skip the cursor item itself
        }),
      });
  
      const hasMore = products.length > limit;
      const pageItems = hasMore ? products.slice(0, limit) : products;
  
      const items = pageItems
        .filter((p) => p.variants.length > 0)
        .map((p) => {
          const variant = p.variants[0]!;
          return {
            id: p.id,
            productName: p.productName,
            productSubtitle: p.productSubtitle,
            slug: p.slug,
            brand: p.brand,
            manualBrand: p.manualBrand,
            category: p.category,
            price: variant.price,
            mrp: variant.mrp,
            emiBasePrice: variant.emiBasePrice,
            condition: variant.condition,
            storage: variant.storage,
            warrantyType: variant.warrantyType,
            image: variant.images[0] ?? null,
          };
        });
  
      const nextCursor = hasMore ? pageItems[pageItems.length - 1]?.id : null;
  
      return { items, nextCursor, hasMore };
    } catch (error) {
      console.error("Failed to fetch filtered buying products:", error);
      throw error;
    }
  }
}

export default new UserBuyingProductService();
