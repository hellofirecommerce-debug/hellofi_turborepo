import AdminBuyingProductService from "../../../services/admin/admin.buyingProduct.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";
import prisma from "@repo/db";
import S3Service from "../../../services/common/s3.service";

export const resolvers = {
  Query: {
    getBuyingProducts: async (
      _: any,
      args: { filter?: any },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBuyingProductService.getBuyingProducts(args.filter);
    },

    getBuyingProductById: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBuyingProductService.getBuyingProductById(args.id);
    },
  },

  Mutation: {
    createBuyingProduct: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);

      // ── Process product-level images ──
      const productImageBuffers: Buffer[] = [];
      const productImageFileNames: string[] = [];

      if (args.productImages) {
        for (const imageUpload of args.productImages) {
          const { createReadStream, filename } = await imageUpload;
          const buffer = await streamToBuffer(createReadStream());
          productImageBuffers.push(buffer);
          productImageFileNames.push(filename);
        }
      }

      // ── Process variant images ──
      const variantImages: {
        variantIndex: number;
        defaultImageIndex: number;
        buffers: Buffer[];
        fileNames: string[];
      }[] = [];

      for (const vi of args.variantImages ?? []) {
        const buffers: Buffer[] = [];
        const fileNames: string[] = [];
        for (const imageUpload of vi.images) {
          const { createReadStream, filename } = await imageUpload;
          const buffer = await streamToBuffer(createReadStream());
          buffers.push(buffer);
          fileNames.push(filename);
        }
        variantImages.push({
          variantIndex: vi.variantIndex,
          defaultImageIndex: vi.defaultImageIndex,
          buffers,
          fileNames,
        });
      }

      return AdminBuyingProductService.createBuyingProduct(
        args.input,
        variantImages,
        productImageBuffers,
        productImageFileNames,
        args.productDefaultImageIndex ?? 0,
      );
    },

    updateBuyingProduct: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBuyingProductService.updateBuyingProduct({
        id: args.id,
        ...args.input,
      });
    },

    deleteBuyingProduct: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBuyingProductService.deleteBuyingProduct(args.id);
    },

    addVariantToProduct: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);

      const imageBuffers: Buffer[] = [];
      const imageFileNames: string[] = [];

      if (args.images) {
        for (const imageUpload of args.images) {
          const { createReadStream, filename } = await imageUpload;
          const buffer = await streamToBuffer(createReadStream());
          imageBuffers.push(buffer);
          imageFileNames.push(filename);
        }
      }

      return AdminBuyingProductService.addVariantToProduct(
        args.productId,
        args.input,
        imageBuffers,
        imageFileNames,
        args.defaultImageIndex,
      );
    },

    deleteVariant: async (
      _: any,
      args: { variantId: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminBuyingProductService.deleteVariant(args.variantId);
    },

    addVariantImages: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);

      const imageBuffers: Buffer[] = [];
      const imageFileNames: string[] = [];

      for (const imageUpload of args.images) {
        const { createReadStream, filename } = await imageUpload;
        const buffer = await streamToBuffer(createReadStream());
        imageBuffers.push(buffer);
        imageFileNames.push(filename);
      }

      return AdminBuyingProductService.addImagesToVariant(
        args.productId,
        args.variantId,
        imageBuffers,
        imageFileNames,
        args.defaultImageIndex,
      );
    },

    deleteVariantImage: async (
      _: any,
      args: { imageId: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);

      const image = await prisma.buyingProductImage.findUnique({
        where: { id: args.imageId },
      });
      if (!image) throw new Error("Image not found");

      await Promise.all(
        [image.xs, image.sm, image.md, image.lg]
          .filter(Boolean)
          .map((url) => S3Service.deleteImage(url!)),
      );

      await prisma.buyingProductImage.delete({ where: { id: args.imageId } });
      return { id: args.imageId, message: "Image deleted successfully" };
    },
  },
};
