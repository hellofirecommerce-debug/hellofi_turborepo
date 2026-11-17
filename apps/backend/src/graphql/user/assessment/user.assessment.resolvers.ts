import UserAssessmentService from "../../../services/user/user.assessment.service";
import { GraphQLContext } from "../../../types";

export const resolvers = {
  Query: {
    getUserAssessmentFlow: async (
      _: any,
      args: { categorySlug: string; brandSlug: string; productSlug: string },
      ctx: GraphQLContext,
    ) => {
      // If you need to require authentication for users, add it here:
      // UserAuthService.requireUser(ctx.req);

      return UserAssessmentService.getAssessmentFlow(
        args.categorySlug,
        args.brandSlug,
        args.productSlug,
      );
    },
  },
};
