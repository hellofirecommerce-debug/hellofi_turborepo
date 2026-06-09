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
// ← helper to build variant data without TypeScript conflict
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
    inventoryProductId: v.inventoryProductId || null, // ← direct field, no connect
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

class AdminBuyingProductService {
  async getBuyingProducts(filter?: {
    search?: string;
    brandId?: string;
    categoryId?: string;
    isTrending?: boolean;
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
        ...(filter?.isTrending !== undefined && {
          isTrending: filter.isTrending,
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
          isTrending: validated.isTrending,
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
            // ── Update existing variant ──
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
            // ── Create new variant ──
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

      // ── Handle image deletions + default image change ──
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

          // ── Handle default image change for existing images ──
          if (vi.existingImageKeys.length === 0) continue;

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
          isTrending: updateData.isTrending,
        },
        include: buyingProductInclude,
      });

      // ── Upload new images in background ──
      if (variantImages && variantImages.length > 0) {
        setImmediate(async () => {
          for (const vi of variantImages) {
            if (!vi.buffers || vi.buffers.length === 0) continue;
            await processAndUploadVariantImages(
              id,
              vi.variantId,
              vi.buffers,
              vi.fileNames,
              -1,
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
