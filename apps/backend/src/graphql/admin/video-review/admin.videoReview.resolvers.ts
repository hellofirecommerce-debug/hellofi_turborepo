import AdminVideoReviewService from "../../../services/admin/admin.videoReview.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";
import { streamToBuffer } from "../../../lib/utils/streamToBuffer";

export const resolvers = {
  Query: {
    getVideoReviews: async (
      _: any,
      args: { type?: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminVideoReviewService.getVideoReviews(args.type);
    },

    getVideoReviewById: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminVideoReviewService.getVideoReviewById(args.id);
    },
  },

  Mutation: {
    createVideoReview: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);

      const { createReadStream: videoStream, filename: videoName } =
        await args.video;
      const { createReadStream: thumbStream, filename: thumbName } =
        await args.thumbnail;

      const [videoBuffer, thumbnailBuffer] = await Promise.all([
        streamToBuffer(videoStream()),
        streamToBuffer(thumbStream()),
      ]);

      return AdminVideoReviewService.createVideoReview(
        args.input,
        videoBuffer,
        videoName,
        thumbnailBuffer,
        thumbName,
      );
    },

    updateVideoReview: async (_: any, args: any, context: GraphQLContext) => {
      AdminAuthService.requireAdmin(context.req);

      let videoBuffer, videoName, thumbnailBuffer, thumbName;

      if (args.video) {
        const { createReadStream, filename } = await args.video;
        videoBuffer = await streamToBuffer(createReadStream());
        videoName = filename;
      }

      if (args.thumbnail) {
        const { createReadStream, filename } = await args.thumbnail;
        thumbnailBuffer = await streamToBuffer(createReadStream());
        thumbName = filename;
      }

      return AdminVideoReviewService.updateVideoReview(
        args.id,
        args.input,
        videoBuffer,
        videoName,
        thumbnailBuffer,
        thumbName,
      );
    },

    deleteVideoReview: async (
      _: any,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(context.req);
      return AdminVideoReviewService.deleteVideoReview(args.id);
    },
  },
};
