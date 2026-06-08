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

      const { input, variantImages } = args;

      const resolvedVariantImages = await Promise.all(
        (variantImages ?? []).map(async (vi: any) => {
          const resolvedImages = await Promise.all(
            vi.images.map(async (upload: any) => {
              const { createReadStream, filename } = await upload;
              const stream = createReadStream();
              const buffer = await streamToBuffer(stream);
              return { buffer, filename };
            }),
          );
          return {
            variantKey: vi.variantKey,
            defaultImageIndex: vi.defaultImageIndex,
            buffers: resolvedImages.map((r: any) => r.buffer),
            fileNames: resolvedImages.map((r: any) => r.filename),
          };
        }),
      );

      return AdminBuyingProductService.createBuyingProduct(
        input,
        resolvedVariantImages,
      );
    },

    updateBuyingProduct: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);

      let resolvedVariantImages;

      if (args.variantImages && args.variantImages.length > 0) {
        resolvedVariantImages = await Promise.all(
          args.variantImages.map(async (vi: any) => {
            let buffers: Buffer[] = [];
            let fileNames: string[] = [];

            if (vi.images && vi.images.length > 0) {
              const resolved = await Promise.all(vi.images);
              buffers = await Promise.all(
                resolved.map((upload: any) =>
                  streamToBuffer(upload.createReadStream()),
                ),
              );
              fileNames = resolved.map((upload: any) => upload.filename);
            }

            return {
              variantId: vi.variantKey,
              defaultImageIndex: vi.defaultImageIndex,
              buffers,
              fileNames,
              existingImageKeys: vi.existingImageKeys ?? [],
            };
          }),
        );
      }

      return AdminBuyingProductService.updateBuyingProduct(
        { id: args.id, ...args.input },
        resolvedVariantImages,
      );
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
