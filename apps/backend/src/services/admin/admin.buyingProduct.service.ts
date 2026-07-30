import prisma from "@repo/db";
import {
  handleServiceError,
  throwNotFoundError,
  throwInputError,
} from "../../lib/utils/error";
import { validateOrThrow } from "../../lib/utils/validateOrThrow";
import S3Service from "../common/s3.service";
import ImageService from "../common/image.service";
import { generateImageKey } from "../../lib/utils/imageKey";
import { generateSKU } from "../../lib/utils/generateSKU";
import {
  createBuyingProductSchema,
  updateBuyingProductSchema,
  CreateBuyingProductInput,
  UpdateBuyingProductInput,
} from "@repo/validations";
import { generateRandomString } from "../../lib/utils/generateRandomString";

const MAX_ITEMS_PER_SECTION = 7;

const buyingProductInclude = {
  brand: true,
  category: true,
  variants: {
    include: {
      images: { orderBy: { priority: "asc" as const } },
      inventoryProduct: {
        select: {
          id: true,
          productName: true,
          imeiOrSerial: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
  specifications: { orderBy: { sortOrder: "asc" as const } },
};

async function processAndUploadVariantImages(
  productId: string,
  variantId: string,
  imageBuffers: Buffer[],
  imageFileNames: string[],
  defaultImageIndex: number,
) {
  try {
    for (let i = 0; i < imageBuffers.length; i++) {
      const buffer = imageBuffers[i]!;
      const isDefault = defaultImageIndex >= 0 && i === defaultImageIndex;

      const { xs, sm, md, lg } = await ImageService.compressMultiSize(buffer);

      const uniqueId = generateRandomString(8);

      const baseKey = generateImageKey(
        `buying-product-images/${productId}/${variantId}`,
        uniqueId,
      );

      const [xsUrl, smUrl, mdUrl, lgUrl] = await Promise.all([
        S3Service.uploadImage(xs, `${baseKey}-xs`),
        S3Service.uploadImage(sm, `${baseKey}-sm`),
        S3Service.uploadImage(md, `${baseKey}-md`),
        S3Service.uploadImage(lg, `${baseKey}-lg`),
      ]);

      const existingCount = await prisma.buyingProductImage.count({
        where: { variantId },
      });

      await prisma.buyingProductImage.create({
        data: {
          variantId,
          xs: xsUrl,
          sm: smUrl,
          md: mdUrl,
          lg: lgUrl,
          alt: imageFileNames[i] ?? "",
          priority: existingCount,
          isDefault,
        },
      });
    }
    console.log(`✅ Images processed for variant ${variantId}`);
  } catch (error) {
    console.error(
      `❌ Image processing failed for variant ${variantId}:`,
      error,
    );
  }
}

function buildVariantData(
  v: {
    variantSubtitle: string;
    inventoryProductId?: string;
    liveLink?: string;
    color?: string;
    colorCode?: string;
    storage?: string;
    ram?: string;
    price: number;
    mrp: number;
    emiBasePrice?: number;
    quantity: number;
    productSpec?: string;
    condition: string;
    availability?: string;
    screenSize?: string;
    os?: string;
    processor?: string;
    batteryCapacity?: string;
    warrantyType: string;
    warrantyDescription?: string;
    whatsInTheBox?: string[];
    whatsExtra?: string;
  },
  sku: string,
) {
  return {
    sku,
    variantSubtitle: v.variantSubtitle,
    inventoryProductId: v.inventoryProductId || null,
    liveLink: v.liveLink ?? null,
    color: v.color ?? null,
    colorCode: v.colorCode ?? null,
    storage: v.storage ?? null,
    ram: v.ram ?? null,
    price: v.price,
    mrp: v.mrp,
    emiBasePrice: v.emiBasePrice ?? null,
    quantity: v.quantity,
    productSpec: v.productSpec ?? null,
    condition: v.condition as any,
    availability: (v.availability ?? "IN_STOCK") as any,
    screenSize: v.screenSize ?? null,
    os: (v.os as any) ?? null,
    processor: v.processor ?? null,
    batteryCapacity: v.batteryCapacity ?? null,
    warrantyType: v.warrantyType as any,
    warrantyDescription: v.warrantyDescription ?? null,
    whatsInTheBox: v.whatsInTheBox ?? [],
    whatsExtra: v.whatsExtra ?? null,
  };
}

// ── Enforce: Mega Dhamaka allows max 1 Apple product + 1 non-Apple product per category ──
async function assertMegaDhamakaCapacity(params: {
  categoryId: string;
  brandId: string | null | undefined;
  isMegaDhamaka: boolean | undefined;
  excludeProductId?: string;
}) {
  const { categoryId, brandId, isMegaDhamaka, excludeProductId } = params;

  if (isMegaDhamaka !== true) return;

  const brand = brandId
    ? await prisma.brand.findUnique({ where: { id: brandId } })
    : null;
  const isApple = brand?.name?.toLowerCase() === "apple";

  const existing = await prisma.buyingProduct.findMany({
    where: {
      categoryId,
      isMegaDhamaka: true,
      ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
    },
    include: { brand: true },
  });

  const appleSlotTaken = existing.some(
    (p) => p.brand?.name?.toLowerCase() === "apple",
  );
  const otherSlotTaken = existing.some(
    (p) => p.brand?.name?.toLowerCase() !== "apple",
  );

  if (isApple && appleSlotTaken) {
    throwInputError(
      "Mega Dhamaka already has an Apple product for this category. Remove it before adding another.",
    );
  }

  if (!isApple && otherSlotTaken) {
    throwInputError(
      "Mega Dhamaka already has a non-Apple product for this category. Remove it before adding another.",
    );
  }
}

// ── Enforce: only ONE of {featuredSection, isTopSelling, isGaming} can be active ──
function assertPlacementCompatibility(
  featuredSection: string | undefined,
  isTopSelling: boolean | undefined,
  isGaming: boolean | undefined,
) {
  const activeCount = [
    featuredSection !== undefined && featuredSection !== "NONE",
    isTopSelling === true,
    isGaming === true,
  ].filter(Boolean).length;

  if (activeCount > 1) {
    throwInputError(
      "A product can only have one placement at a time — Featured Section (Most Loved / People Love), Top Selling, or Gaming. Choose only one.",
    );
  }
}

// ── Enforce: max MAX_ITEMS_PER_SECTION products per category for a given flag ──
async function assertSectionCapacity(params: {
  categoryId: string;
  featuredSection?: string;
  isTopSelling?: boolean;
  isGaming?: boolean;
  excludeProductId?: string;
}) {
  const {
    categoryId,
    featuredSection,
    isTopSelling,
    isGaming,
    excludeProductId,
  } = params;

  if (featuredSection && featuredSection !== "NONE") {
    const count = await prisma.buyingProduct.count({
      where: {
        categoryId,
        featuredSection: featuredSection as any,
        ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      },
    });
    if (count >= MAX_ITEMS_PER_SECTION) {
      const label =
        featuredSection === "MOST_LOVED"
          ? "Most Loved This Week"
          : "Phones People Are Loving";
      throwInputError(
        `"${label}" already has ${MAX_ITEMS_PER_SECTION} products for this category. Remove one before adding another.`,
      );
    }
  }

  if (isTopSelling === true) {
    const count = await prisma.buyingProduct.count({
      where: {
        categoryId,
        isTopSelling: true,
        ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      },
    });
    if (count >= MAX_ITEMS_PER_SECTION) {
      throwInputError(
        `"Top Selling" already has ${MAX_ITEMS_PER_SECTION} products for this category. Remove one before adding another.`,
      );
    }
  }

  if (isGaming === true) {
    const count = await prisma.buyingProduct.count({
      where: {
        categoryId,
        isGaming: true,
        ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      },
    });
    if (count >= MAX_ITEMS_PER_SECTION) {
      throwInputError(
        `"Gaming" already has ${MAX_ITEMS_PER_SECTION} products for this category. Remove one before adding another.`,
      );
    }
  }
}

class AdminBuyingProductService {
  async getBuyingProducts(filter?: {
    search?: string;
    brandId?: string;
    categoryId?: string;
    featuredSection?: "NONE" | "MOST_LOVED" | "PEOPLE_LOVE";
    isTrending?: boolean;
    isTopSelling?: boolean;
    isGaming?: boolean;
    isMegaDhamaka?: boolean;
    availability?: "IN_STOCK" | "OUT_OF_STOCK"; // ← new
    page?: number;
    pageSize?: number;
  }) {
    try {
      const page = filter?.page ?? 1;
      const pageSize = filter?.pageSize ?? 10;
      const skip = (page - 1) * pageSize;

      const where: any = {
        ...(filter?.search && {
          OR: [
            { productName: { contains: filter.search, mode: "insensitive" } },
            { slug: { contains: filter.search, mode: "insensitive" } },
          ],
        }),
        ...(filter?.brandId && { brandId: filter.brandId }),
        ...(filter?.categoryId && { categoryId: filter.categoryId }),
        ...(filter?.featuredSection && {
          featuredSection: filter.featuredSection,
        }),
        ...(filter?.isTrending !== undefined && {
          isTrending: filter.isTrending,
        }),
        ...(filter?.isTopSelling !== undefined && {
          isTopSelling: filter.isTopSelling,
        }),
        ...(filter?.isGaming !== undefined && {
          isGaming: filter.isGaming,
        }),
        ...(filter?.isMegaDhamaka !== undefined && {
          isMegaDhamaka: filter.isMegaDhamaka,
        }),
        // ── Stock status: derived from variant quantity, reservedQuantity is irrelevant ──
        ...(filter?.availability === "IN_STOCK" && {
          variants: { some: { quantity: { gt: 0 } } },
        }),
        ...(filter?.availability === "OUT_OF_STOCK" && {
          variants: { none: { quantity: { gt: 0 } } },
        }),
      };

      const [items, total] = await Promise.all([
        prisma.buyingProduct.findMany({
          where,
          include: buyingProductInclude,
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.buyingProduct.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async getBuyingProductById(id: string) {
    try {
      const product = await prisma.buyingProduct.findUnique({
        where: { id },
        include: buyingProductInclude,
      });
      if (!product) return throwNotFoundError("Buying product not found");
      return product;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createBuyingProduct(
    input: CreateBuyingProductInput,
    variantImages: {
      variantKey: string;
      defaultImageIndex: number;
      buffers: Buffer[];
      fileNames: string[];
    }[],
  ) {
    try {
      const validated = validateOrThrow(createBuyingProductSchema, input);

      const existing = await prisma.buyingProduct.findUnique({
        where: { slug: validated.slug },
      });
      if (existing) {
        throwInputError(`Product with slug "${validated.slug}" already exists`);
        return;
      }

      // ── Mutual exclusivity + capacity checks ──
      assertPlacementCompatibility(
        validated.featuredSection,
        validated.isTopSelling,
        validated.isGaming,
      );
      await assertSectionCapacity({
        categoryId: validated.categoryId,
        featuredSection: validated.featuredSection,
        isTopSelling: validated.isTopSelling,
        isGaming: validated.isGaming,
      });
      await assertMegaDhamakaCapacity({
        categoryId: validated.categoryId,
        brandId: validated.brandId,
        isMegaDhamaka: validated.isMegaDhamaka,
      });

      for (const variant of validated.variants ?? []) {
        if (!variant.variantKey) continue;
        const vi = variantImages.find(
          (v) => v.variantKey === variant.variantKey,
        );
        if (!vi || vi.buffers.length === 0) {
          throwInputError(`All variants must have at least one image`);
          return;
        }
      }

      const product = await prisma.buyingProduct.create({
        data: {
          productName: validated.productName,
          productSubtitle: validated.productSubtitle,
          slug: validated.slug,
          brandId: validated.brandId || null,
          manualBrand: validated.manualBrand || null,
          categoryId: validated.categoryId,
          featuredSection: (validated.featuredSection ?? "NONE") as any,
          isTrending: validated.isTrending,
          isTopSelling: validated.isTopSelling ?? false,
          isGaming: validated.isGaming ?? false,
          isMegaDhamaka: validated.isMegaDhamaka ?? false,
          specifications: {
            create: (validated.specifications ?? []).map((s) => ({
              key: s.key,
              value: s.value,
              group: s.group ?? null,
              sortOrder: s.sortOrder,
            })),
          },
          variants: {
            create: (validated.variants ?? []).map((v, i) =>
              buildVariantData(v as any, generateSKU(validated.productName, i)),
            ),
          },
        },
        include: buyingProductInclude,
      });

      console.log(`✅ Product created: ${product.productName}`);

      setImmediate(async () => {
        const variantsList = validated.variants ?? [];
        for (let i = 0; i < variantsList.length; i++) {
          const variant = variantsList[i]!;
          if (!variant.variantKey) continue;

          const createdVariant = (product as any).variants[i];
          if (!createdVariant) continue;

          const vi = variantImages.find(
            (v) => v.variantKey === variant.variantKey,
          );
          if (!vi || vi.buffers.length === 0) continue;

          await processAndUploadVariantImages(
            product.id,
            createdVariant.id,
            vi.buffers,
            vi.fileNames,
            vi.defaultImageIndex,
          );
        }
        console.log(
          `✅ All variant images processed for product ${product.id}`,
        );
      });

      return product;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteVariantImages(imageIds: string[]): Promise<void> {
    if (imageIds.length === 0) return;

    const images = await prisma.buyingProductImage.findMany({
      where: { id: { in: imageIds } },
    });

    for (const img of images) {
      const keysToDelete = [img.xs, img.sm, img.md, img.lg].filter(
        Boolean,
      ) as string[];

      for (const key of keysToDelete) {
        await S3Service.deleteFile(key);
      }
    }

    await prisma.buyingProductImage.deleteMany({
      where: { id: { in: imageIds } },
    });
  }

  async updateBuyingProduct(
    input: UpdateBuyingProductInput,
    variantImages?: {
      variantId: string;
      defaultImageIndex: number;
      buffers: Buffer[];
      fileNames: string[];
      existingImageKeys?: string[];
    }[],
  ) {
    try {
      const validated = validateOrThrow(updateBuyingProductSchema, input);
      const { id, variants, specifications, ...updateData } = validated;

      const product = await prisma.buyingProduct.findUnique({ where: { id } });
      if (!product) return throwNotFoundError("Buying product not found");

      // ── Resolve effective values (fall back to existing product's current value) ──
      const effectiveCategoryId = updateData.categoryId ?? product.categoryId;
      const effectiveBrandId = updateData.brandId ?? product.brandId;
      const effectiveFeaturedSection =
        updateData.featuredSection ?? (product as any).featuredSection;
      const effectiveIsTopSelling =
        updateData.isTopSelling ?? (product as any).isTopSelling;
      const effectiveIsGaming =
        updateData.isGaming ?? (product as any).isGaming;
      const effectiveIsMegaDhamaka =
        updateData.isMegaDhamaka ?? (product as any).isMegaDhamaka;

      // ── Mutual exclusivity check ──
      assertPlacementCompatibility(
        effectiveFeaturedSection,
        effectiveIsTopSelling,
        effectiveIsGaming,
      );

      // ── Capacity check — only re-check the flags that are actually changing ──
      const featuredSectionChanging =
        updateData.featuredSection !== undefined &&
        updateData.featuredSection !== (product as any).featuredSection;
      const isTopSellingChanging =
        updateData.isTopSelling !== undefined &&
        updateData.isTopSelling !== (product as any).isTopSelling;
      const isGamingChanging =
        updateData.isGaming !== undefined &&
        updateData.isGaming !== (product as any).isGaming;
      const isMegaDhamakaChanging =
        updateData.isMegaDhamaka !== undefined &&
        updateData.isMegaDhamaka !== (product as any).isMegaDhamaka;

      if (featuredSectionChanging || isTopSellingChanging || isGamingChanging) {
        await assertSectionCapacity({
          categoryId: effectiveCategoryId,
          featuredSection: featuredSectionChanging
            ? effectiveFeaturedSection
            : undefined,
          isTopSelling: isTopSellingChanging
            ? effectiveIsTopSelling
            : undefined,
          isGaming: isGamingChanging ? effectiveIsGaming : undefined,
          excludeProductId: id,
        });
      }

      if (isMegaDhamakaChanging) {
        await assertMegaDhamakaCapacity({
          categoryId: effectiveCategoryId,
          brandId: effectiveBrandId,
          isMegaDhamaka: effectiveIsMegaDhamaka,
          excludeProductId: id,
        });
      }

      // ── Update specifications ──
      if (specifications && specifications.length > 0) {
        await prisma.buyingSpecification.deleteMany({
          where: { productId: id },
        });
        await prisma.buyingSpecification.createMany({
          data: specifications.map((s) => ({
            productId: id,
            key: s.key,
            value: s.value,
            group: s.group ?? null,
            sortOrder: s.sortOrder,
          })),
        });
      }

      // ── Update or create variants ──
      if (variants && variants.length > 0) {
        const existingVariantIds = (
          await prisma.buyingVariant.findMany({
            where: { productId: id },
            select: { id: true },
          })
        ).map((v) => v.id);

        for (const v of variants as any[]) {
          const isExisting = existingVariantIds.includes(v.variantKey);

          if (isExisting) {
            await prisma.buyingVariant.update({
              where: { id: v.variantKey },
              data: {
                variantSubtitle: v.variantSubtitle ?? undefined,
                inventoryProductId: v.inventoryProductId ?? null,
                liveLink: v.liveLink ?? null,
                color: v.color ?? null,
                colorCode: v.colorCode ?? null,
                storage: v.storage ?? null,
                ram: v.ram ?? null,
                price: v.price ?? undefined,
                mrp: v.mrp ?? undefined,
                emiBasePrice: v.emiBasePrice ?? null,
                quantity: v.quantity ?? undefined,
                productSpec: v.productSpec ?? null,
                condition: v.condition as any,
                availability: v.availability as any,
                screenSize: v.screenSize ?? null,
                os: (v.os || null) as any,
                processor: v.processor ?? null,
                batteryCapacity: v.batteryCapacity ?? null,
                warrantyType: v.warrantyType as any,
                warrantyDescription: v.warrantyDescription ?? null,
                whatsInTheBox: v.whatsInTheBox ?? [],
                whatsExtra: v.whatsExtra ?? null,
              },
            });
          } else {
            const existingCount = await prisma.buyingVariant.count({
              where: { productId: id },
            });

            const newVariant = await prisma.buyingVariant.create({
              data: {
                productId: id,
                ...buildVariantData(
                  v,
                  generateSKU(product.productName, existingCount),
                ),
              },
            });

            // ── Remap variantId in variantImages to real DB id ──
            if (variantImages) {
              const vi = variantImages.find(
                (img) => img.variantId === v.variantKey,
              );
              if (vi) vi.variantId = newVariant.id;
            }
          }
        }
      }

      // ── Handle image deletions + priority update + default image change ──
      if (variantImages && variantImages.length > 0) {
        for (const vi of variantImages) {
          if (!vi.existingImageKeys) continue;

          const currentImages = await prisma.buyingProductImage.findMany({
            where: { variantId: vi.variantId },
          });

          // ── Delete removed images ──
          const removedImageIds = currentImages
            .filter((img) => img.md && !vi.existingImageKeys!.includes(img.md))
            .map((img) => img.id);

          await this.deleteVariantImages(removedImageIds);

          if (vi.existingImageKeys.length === 0) continue;

          // ── Update priority for existing images based on new order ──
          for (let i = 0; i < vi.existingImageKeys.length; i++) {
            const key = vi.existingImageKeys[i];
            if (!key) continue;
            await prisma.buyingProductImage.updateMany({
              where: { variantId: vi.variantId, md: key },
              data: { priority: i },
            });
          }

          // ── Handle default image change for existing images ──
          const defaultIsExisting =
            vi.defaultImageIndex < vi.existingImageKeys.length;

          if (defaultIsExisting) {
            const defaultKey = vi.existingImageKeys[vi.defaultImageIndex];
            if (!defaultKey) continue;

            await prisma.buyingProductImage.updateMany({
              where: { variantId: vi.variantId },
              data: { isDefault: false },
            });

            await prisma.buyingProductImage.updateMany({
              where: { variantId: vi.variantId, md: defaultKey },
              data: { isDefault: true },
            });
          }
        }
      }

      // ── Update product fields ──
      const updated = await prisma.buyingProduct.update({
        where: { id },
        data: {
          ...updateData,
          brandId: updateData.brandId || null,
          manualBrand: updateData.manualBrand || null,
          featuredSection: (updateData.featuredSection ?? undefined) as any,
          isTrending: updateData.isTrending,
          isTopSelling: updateData.isTopSelling,
          isGaming: updateData.isGaming,
          isMegaDhamaka: updateData.isMegaDhamaka,
        },
        include: buyingProductInclude,
      });

      // ── Upload new images in background ──
      if (variantImages && variantImages.length > 0) {
        setImmediate(async () => {
          for (const vi of variantImages) {
            if (!vi.buffers || vi.buffers.length === 0) continue;

            const existingKeysLength = vi.existingImageKeys?.length ?? 0;
            const defaultIsNewImage =
              vi.defaultImageIndex >= existingKeysLength;
            const newImageDefaultIndex = defaultIsNewImage
              ? vi.defaultImageIndex - existingKeysLength
              : -1;

            if (defaultIsNewImage) {
              await prisma.buyingProductImage.updateMany({
                where: { variantId: vi.variantId },
                data: { isDefault: false },
              });
            }

            await processAndUploadVariantImages(
              id,
              vi.variantId,
              vi.buffers,
              vi.fileNames,
              newImageDefaultIndex,
            );
          }
        });
      }

      return updated;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteBuyingProduct(id: string) {
    try {
      const product = await prisma.buyingProduct.findUnique({
        where: { id },
        include: { variants: { include: { images: true } } },
      });
      if (!product) return throwNotFoundError("Buying product not found");

      const allImages = product.variants.flatMap((v) => v.images);
      await Promise.all(
        allImages.flatMap((img) =>
          [img.xs, img.sm, img.md, img.lg]
            .filter(Boolean)
            .map((url) => S3Service.deleteImage(url!)),
        ),
      );

      await prisma.buyingProduct.delete({ where: { id } });
      return { id, message: "Buying product deleted successfully" };
    } catch (error) {
      handleServiceError(error);
    }
  }

  async addVariantToProduct(
    productId: string,
    variantInput: any,
    imageBuffers: Buffer[],
    imageFileNames: string[],
    defaultImageIndex: number,
  ) {
    try {
      const product = await prisma.buyingProduct.findUnique({
        where: { id: productId },
      });
      if (!product) return throwNotFoundError("Product not found");

      if (imageBuffers.length === 0) {
        throwInputError("At least one image is required for the variant");
        return;
      }

      if (defaultImageIndex < 0 || defaultImageIndex >= imageBuffers.length) {
        throwInputError("Invalid default image selection");
        return;
      }

      const existingCount = await prisma.buyingVariant.count({
        where: { productId },
      });

      const variant = await prisma.buyingVariant.create({
        data: {
          productId,
          ...buildVariantData(
            variantInput,
            generateSKU(product.productName, existingCount),
          ),
        },
      });

      setImmediate(async () => {
        await processAndUploadVariantImages(
          productId,
          variant.id,
          imageBuffers,
          imageFileNames,
          defaultImageIndex,
        );
      });

      return variant;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async addImagesToVariant(
    productId: string,
    variantId: string,
    imageBuffers: Buffer[],
    imageFileNames: string[],
    defaultImageIndex: number,
  ) {
    if (imageBuffers.length === 0) {
      throwInputError("At least one image is required");
      return;
    }
    if (defaultImageIndex < 0 || defaultImageIndex >= imageBuffers.length) {
      throwInputError("Invalid default image selection");
      return;
    }

    setImmediate(async () => {
      await processAndUploadVariantImages(
        productId,
        variantId,
        imageBuffers,
        imageFileNames,
        defaultImageIndex,
      );
      console.log(`✅ Images added to variant ${variantId}`);
    });

    return this.getBuyingProductById(productId);
  }

  async deleteVariant(variantId: string) {
    try {
      const variant = await prisma.buyingVariant.findUnique({
        where: { id: variantId },
        include: { images: true },
      });
      if (!variant) return throwNotFoundError("Variant not found");

      await Promise.all(
        variant.images.flatMap((img) =>
          [img.xs, img.sm, img.md, img.lg]
            .filter(Boolean)
            .map((url) => S3Service.deleteImage(url!)),
        ),
      );

      await prisma.buyingVariant.delete({ where: { id: variantId } });
      return { id: variantId, message: "Variant deleted successfully" };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminBuyingProductService();
