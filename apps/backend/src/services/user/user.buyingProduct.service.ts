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

  async getInStockBrandIds(): Promise<string[]> {
    try {
      const result = await prisma.buyingProduct.findMany({
        where: {
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
}

export default new UserBuyingProductService();
