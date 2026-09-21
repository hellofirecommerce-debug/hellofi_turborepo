// resolvers/user/user.series.resolver.ts
import UserSeriesService from "../../../services/user/user.series.service";

export const resolvers = {
  Query: {
    getSeriesByBrandSeoName: async (
      _: any,
      args: { brandSeoName: string; categorySeoName?: string },
    ) => {
      return UserSeriesService.getSeriesByBrandSeoName(
        args.brandSeoName,
        args.categorySeoName,
      );
    },
  },
};
