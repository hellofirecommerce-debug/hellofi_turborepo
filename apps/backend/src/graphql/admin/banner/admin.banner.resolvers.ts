import AdminBannerService from "../../../services/admin/admin.banner.service";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";

export const resolvers = {
  Query: {
    banners: async (_parent: unknown, args: { placement?: string }) => {
      return AdminBannerService.getAllBanners(args.placement);
    },

    activeBanners: async (_parent: unknown, args: { placement: string }) => {
      return AdminBannerService.getActiveBanners(args.placement);
    },
  },

  Mutation: {
    createBanner: async (_parent: unknown, args: any) => {
      const {
        alt,
        redirectUrl,
        placement,
        priority,
        isActive,
        startDate,
        endDate,
        lgFile,
        smFile,
      } = args;

      // resolve desktop upload -> buffer
      const lg = await lgFile;
      const lgBuffer = await streamToBuffer(lg.createReadStream());
      const lgFileName = lg.filename;

      // resolve mobile upload -> buffer
      const sm = await smFile;
      const smBuffer = await streamToBuffer(sm.createReadStream());
      const smFileName = sm.filename;

      return AdminBannerService.createBanner({
        alt,
        redirectUrl,
        placement,
        priority,
        isActive,
        startDate,
        endDate,
        lgBuffer,
        lgFileName,
        smBuffer,
        smFileName,
      });
    },

    updateBanner: async (_parent: unknown, args: any) => {
      const {
        id,
        alt,
        redirectUrl,
        placement,
        priority,
        isActive,
        startDate,
        endDate,
        lgFile,
        smFile,
      } = args;

      return AdminBannerService.updateBanner(
        {
          id,
          alt,
          redirectUrl,
          placement,
          priority,
          isActive,
          startDate,
          endDate,
        },
        lgFile ?? null,
        smFile ?? null,
      );
    },

    deleteBanner: async (_parent: unknown, args: { id: string }) => {
      return AdminBannerService.deleteBanner(args.id);
    },
  },
};
