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
  createSellingProductSchema,
  updateSellingProductSchema,
  CreateSellingProductInput,
  UpdateSellingProductInput,
} from "@repo/validations";

const PRODUCT_IMAGE_WIDTH = 400;
const PRODUCT_IMAGE_HEIGHT = 400;

const sellingProductInclude = {
  brand: true,
  category: true,
  series: true,
  variants: {
    orderBy: { createdAt: "asc" as const },
  },
};

class AdminSellingProductService {
  async getSellingProducts(filter?: {
    search?: string;
    brandId?: string;
    categoryId?: string;
    seriesId?: string;
    status?: string;
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
            {
              productSeoName: { contains: filter.search, mode: "insensitive" },
            },
          ],
        }),
        ...(filter?.brandId && { brandId: filter.brandId }),
        ...(filter?.categoryId && { categoryId: filter.categoryId }),
        ...(filter?.seriesId && { seriesId: filter.seriesId }),
        ...(filter?.status && { status: filter.status }),
      };

      const [items, total] = await Promise.all([
        prisma.sellingProduct.findMany({
          where,
          include: sellingProductInclude,
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.sellingProduct.count({ where }),
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

  async getSellingProductById(id: string) {
    try {
      const product = await prisma.sellingProduct.findUnique({
        where: { id },
        include: sellingProductInclude,
      });
      if (!product) return throwNotFoundError("Selling product not found");
      return product;
    } catch (error) {
      handleServiceError(error);
    }
  }

  async createSellingProduct(
    input: CreateSellingProductInput,
    imageBuffer: Buffer,
    imageFileName: string,
  ) {
    try {
      const validated = validateOrThrow(createSellingProductSchema, input);
      validateImage(imageBuffer, imageFileName);

      // ── Check duplicate seoName ──
      const existing = await prisma.sellingProduct.findUnique({
        where: { productSeoName: validated.productSeoName },
      });
      if (existing) {
        throwInputError(
          `Product with SEO name "${validated.productSeoName}" already exists`,
        );
        return;
      }

      // ── isConstantRam logic ──
      // if isConstantRam = true → ram stored on product, variants have no ram
      // if isConstantRam = false → ram stored on each variant, product ram = null
      const productRam = validated.isConstantRam
        ? (validated.ram ?? null)
        : null;

      const variants = validated.hasVariants
        ? (validated.variants ?? []).map((v) => ({
            ram: validated.isConstantRam ? null : (v.ram ?? null),
            storage: v.storage,
            productPrice: v.productPrice,
            status: v.status as any,
          }))
        : [];

      // ── Create with placeholder image ──
      const product = await prisma.sellingProduct.create({
        data: {
          productName: validated.productName,
          productSeoName: validated.productSeoName,
          brandId: validated.brandId,
          categoryId: validated.categoryId,
          seriesId: validated.seriesId,
          releasedYear: validated.releasedYear ?? null,
          launchedDate: validated.launchedDate
            ? new Date(validated.launchedDate)
            : null,
          productPrice: validated.productPrice ?? null,
          status: validated.status as any,
          hasVariants: validated.hasVariants,
          isConstantRam: validated.isConstantRam,
          ram: productRam,
          image: "pending",
          variants: {
            create: variants,
          },
        },
        include: sellingProductInclude,
      });

      // ── Upload image ──
      const compressed = await ImageService.compress(imageBuffer, {
        width: PRODUCT_IMAGE_WIDTH,
        height: PRODUCT_IMAGE_HEIGHT,
      });
      const key = generateImageKey("selling-product-images", product.id);
      const imageUrl = await S3Service.uploadImage(compressed, key);

      return await prisma.sellingProduct.update({
        where: { id: product.id },
        data: { image: imageUrl },
        include: sellingProductInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async updateSellingProduct(
    input: UpdateSellingProductInput,
    imageFile: any | null,
  ) {
    try {
      const validated = validateOrThrow(updateSellingProductSchema, input);
      const { id, variants, ...updateData } = validated;

      const product = await prisma.sellingProduct.findUnique({
        where: { id },
      });
      if (!product) return throwNotFoundError("Selling product not found");

      // ── isConstantRam logic ──
      const productRam =
        validated.isConstantRam !== undefined
          ? validated.isConstantRam
            ? (validated.ram ?? product.ram ?? null)
            : null
          : product.ram;

      const baseUpdateData = {
        ...updateData,
        ram: productRam,
        launchedDate: updateData.launchedDate
          ? new Date(updateData.launchedDate)
          : undefined,
        status: updateData.status as any,
      };

      // ── Handle image update ──
      let imageUrl: string | undefined;
      if (imageFile) {
        const { createReadStream, filename } = await imageFile;
        const imageBuffer = await streamToBuffer(createReadStream());
        validateImage(imageBuffer, filename);

        if (product.image && product.image !== "pending") {
          await S3Service.deleteImage(product.image);
        }

        const compressed = await ImageService.compress(imageBuffer, {
          width: PRODUCT_IMAGE_WIDTH,
          height: PRODUCT_IMAGE_HEIGHT,
        });
        const key = generateImageKey("selling-product-images", product.id);
        imageUrl = await S3Service.uploadImage(compressed, key);
      }

      // ── Update variants if provided ──
      if (variants && variants.length > 0) {
        await prisma.sellingVariant.deleteMany({
          where: { sellingProductId: id },
        });

        const isConstantRam = validated.isConstantRam ?? product.isConstantRam;

        await prisma.sellingVariant.createMany({
          data: variants.map((v) => ({
            sellingProductId: id,
            ram: isConstantRam ? null : (v.ram ?? null),
            storage: v.storage,
            productPrice: v.productPrice,
            status: (v.status as any) ?? "ACTIVE",
          })),
        });
      }

      return await prisma.sellingProduct.update({
        where: { id },
        data: {
          ...baseUpdateData,
          ...(imageUrl && { image: imageUrl }),
        },
        include: sellingProductInclude,
      });
    } catch (error) {
      handleServiceError(error);
    }
  }

  async deleteSellingProduct(id: string) {
    try {
      const product = await prisma.sellingProduct.findUnique({
        where: { id },
      });
      if (!product) return throwNotFoundError("Selling product not found");

      if (product.image && product.image !== "pending") {
        await S3Service.deleteImage(product.image);
      }

      await prisma.sellingProduct.delete({ where: { id } });
      return { id, message: "Selling product deleted successfully" };
    } catch (error) {
      handleServiceError(error);
    }
  }
}

export default new AdminSellingProductService();
