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
import { validateImage } from "../../lib/utils/validateImage";
import { streamToBuffer } from "../../lib/utils/streamToBuffer";
import {
  createBuyingProductSchema,
  updateBuyingProductSchema,
  CreateBuyingProductInput,
  UpdateBuyingProductInput,
} from "@repo/validations";

const buyingProductInclude = {
  brand: true,
  category: true,
  images: { orderBy: { priority: "asc" as const } },
  variants: {
    include: { images: true },
    orderBy: { createdAt: "asc" as const },
  },
  specifications: { orderBy: { sortOrder: "asc" as const } },
};

async function processAndUploadVariantImages(
  productId: string,
  variantId: string,
  imageBuffers: Buffer[],
  imageFileNames: string[],
  defaultImageIndex: number, // ← required, no default — user must pick
) {
  try {
    for (let i = 0; i < imageBuffers.length; i++) {
      const buffer = imageBuffers[i]!;
      const isDefault = i === defaultImageIndex;

      const { xs, sm, md, lg } = await ImageService.compressMultiSize(buffer);

      const baseKey = generateImageKey(
        `buying-product-images/${productId}/${variantId}`,
        `${i}`,
      );

      const [xsUrl, smUrl, mdUrl, lgUrl] = await Promise.all([
        S3Service.uploadImage(xs, `${baseKey}-xs`),
        S3Service.uploadImage(sm, `${baseKey}-sm`),
        S3Service.uploadImage(md, `${baseKey}-md`),
        S3Service.uploadImage(lg, `${baseKey}-lg`),
      ]);

      await prisma.buyingProductImage.create({
        data: {
          productId,
          variantId,
          xs: xsUrl,
          sm: smUrl,
          md: mdUrl,
          lg: lgUrl,
          alt: imageFileNames[i] ?? "",
          priority: i,
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
      variantIndex: number;
      defaultImageIndex: number; // ← user-selected default
      buffers: Buffer[];
      fileNames: string[];
    }[],
    productImageBuffers: Buffer[],
    productImageFileNames: string[],
    productDefaultImageIndex: number, // ← user-selected default for product images
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

      // ── Validate: every variant must have images with a valid defaultImageIndex ──
      const variantCount = validated.variants?.length ?? 0;
      for (let i = 0; i < variantCount; i++) {
        const vi = variantImages.find((v) => v.variantIndex === i);
        if (!vi || vi.buffers.length === 0) {
          throwInputError(`Variant ${i + 1} must have at least one image`);
          return;
        }
        if (
          vi.defaultImageIndex < 0 ||
          vi.defaultImageIndex >= vi.buffers.length
        ) {
          throwInputError(
            `Variant ${i + 1} has an invalid default image selection`,
          );
          return;
        }
      }

      // ── Validate product default image index ──
      if (
        productImageBuffers.length > 0 &&
        (productDefaultImageIndex < 0 ||
          productDefaultImageIndex >= productImageBuffers.length)
      ) {
        throwInputError("Invalid default product image selection");
        return;
      }

      const product = await prisma.buyingProduct.create({
        data: {
          productName: validated.productName,
          productSubtitle: validated.productSubtitle,
          slug: validated.slug,
          brandId: validated.brandId,
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
            create: (validated.variants ?? []).map((v) => ({
              sku: v.sku,
              shortId: v.shortId,
              liveLink: v.liveLink ?? null,
              variantSubtitle: v.variantSubtitle ?? null,
              color: v.color ?? null,
              colorCode: v.colorCode ?? null,
              storage: v.storage,
              ram: v.ram ?? null,
              price: v.price,
              mrp: v.mrp,
              emiBasePrice: v.emiBasePrice ?? null,
              quantity: v.quantity,
              productSpec: v.productSpec ?? null,
              condition: v.condition as any,
              availability: v.availability as any,
              screenSize: v.screenSize ?? null,
              os: (v.os as any) ?? null,
              processor: v.processor ?? null,
              batteryCapacity: v.batteryCapacity ?? null,
              warrantyType: v.warrantyType as any,
              warrantyDescription: v.warrantyDescription ?? null,
              whatsInTheBox: v.whatsInTheBox ?? [],
              whatsExtra: v.whatsExtra ?? null,
            })),
          },
        },
        include: buyingProductInclude,
      });

      console.log(`✅ Product created: ${product.productName}`);

      // ── Process variant images asynchronously — non-blocking ──
      setImmediate(async () => {
        for (const variantImg of variantImages) {
          const variant = product.variants[variantImg.variantIndex];
          if (!variant) continue;
          await processAndUploadVariantImages(
            product.id,
            variant.id,
            variantImg.buffers,
            variantImg.fileNames,
            variantImg.defaultImageIndex, // ← user-selected
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

  async updateBuyingProduct(
    input: UpdateBuyingProductInput,
    variantImages?: {
      variantId: string;
      defaultImageIndex: number; // ← user-selected
      buffers: Buffer[];
      fileNames: string[];
    }[],
  ) {
    try {
      const validated = validateOrThrow(updateBuyingProductSchema, input);
      const { id, variants, specifications, ...updateData } = validated;

      const product = await prisma.buyingProduct.findUnique({ where: { id } });
      if (!product) return throwNotFoundError("Buying product not found");

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

      const updated = await prisma.buyingProduct.update({
        where: { id },
        data: { ...updateData, isTrending: updateData.isTrending },
        include: buyingProductInclude,
      });

      if (variantImages && variantImages.length > 0) {
        setImmediate(async () => {
          for (const vi of variantImages) {
            await processAndUploadVariantImages(
              id,
              vi.variantId,
              vi.buffers,
              vi.fileNames,
              vi.defaultImageIndex, // ← user-selected
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
        include: { images: true, variants: { include: { images: true } } },
      });
      if (!product) return throwNotFoundError("Buying product not found");

      const allImages = [
        ...product.images,
        ...product.variants.flatMap((v) => v.images),
      ];

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
    defaultImageIndex: number, // ← user-selected, required
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

      const variant = await prisma.buyingVariant.create({
        data: {
          productId,
          sku: variantInput.sku,
          shortId: variantInput.shortId,
          liveLink: variantInput.liveLink ?? null,
          variantSubtitle: variantInput.variantSubtitle ?? null,
          color: variantInput.color ?? null,
          colorCode: variantInput.colorCode ?? null,
          storage: variantInput.storage,
          ram: variantInput.ram ?? null,
          price: variantInput.price,
          mrp: variantInput.mrp,
          emiBasePrice: variantInput.emiBasePrice ?? null,
          quantity: variantInput.quantity,
          productSpec: variantInput.productSpec ?? null,
          condition: variantInput.condition,
          availability: variantInput.availability ?? "IN_STOCK",
          screenSize: variantInput.screenSize ?? null,
          os: variantInput.os ?? null,
          processor: variantInput.processor ?? null,
          batteryCapacity: variantInput.batteryCapacity ?? null,
          warrantyType: variantInput.warrantyType,
          warrantyDescription: variantInput.warrantyDescription ?? null,
          whatsInTheBox: variantInput.whatsInTheBox ?? [],
          whatsExtra: variantInput.whatsExtra ?? null,
        },
      });

      setImmediate(async () => {
        await processAndUploadVariantImages(
          productId,
          variant.id,
          imageBuffers,
          imageFileNames,
          defaultImageIndex, // ← user-selected
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
    defaultImageIndex: number, // ← required, user must pick
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
