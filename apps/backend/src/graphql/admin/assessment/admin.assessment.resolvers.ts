import AdminAssessmentService from "../../../services/admin/admin.assessment.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";

export const resolvers = {
  Query: {
    getAssessments: async (
      _: any,
      args: { categoryId?: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.getAssessments({
        categoryId: args.categoryId,
      });
    },

    getAssessmentById: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.getAssessmentById(args.id);
    },

    getAssessmentByCategory: async (
      _: any,
      args: { categoryId: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.getAssessmentByCategory(args.categoryId);
    },

    getSteps: async (
      _: any,
      args: { assessmentId?: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.getSteps({
        assessmentId: args.assessmentId,
      });
    },

    getStepById: async (_: any, args: { id: string }, ctx: GraphQLContext) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.getStepById(args.id);
    },
  },

  Mutation: {
    createAssessment: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.createAssessment(args.input);
    },

    updateAssessment: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.updateAssessment(args.input);
    },

    deleteAssessment: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.deleteAssessment(args.id);
    },

    createAssessmentStep: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.createStep(args.input);
    },

    updateAssessmentStep: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.updateStep(args.input);
    },

    deleteAssessmentStep: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminAssessmentService.deleteStep(args.id);
    },
  },
};
