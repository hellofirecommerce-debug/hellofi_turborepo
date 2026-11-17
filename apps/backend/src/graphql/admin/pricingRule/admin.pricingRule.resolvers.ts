import AdminPricingRuleService from "../../../services/admin/admin.pricingRule.service";
import AdminAuthService from "../../../services/auth/admin/admin.auth.service";
import { GraphQLContext } from "../../../types";

export const resolvers = {
  Query: {
    getConditionRules: async (
      _: any,
      args: { filter?: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.getConditionRules(args.filter);
    },

    getConditionRuleById: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.getConditionRuleById(args.id);
    },
  },

  Mutation: {
    createConditionRule: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.createConditionRule(args.input);
    },

    updateConditionRule: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.updateConditionRule(args.input);
    },

    deleteConditionRule: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.deleteConditionRule(args.id);
    },

    createBrandScore: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.createBrandScore(args.input);
    },

    deleteBrandScore: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.deleteBrandScore(args.id);
    },

    createSeriesScore: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.createSeriesScore(args.input);
    },

    deleteSeriesScore: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.deleteSeriesScore(args.id);
    },

    createProductScore: async (
      _: any,
      args: { input: any },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.createProductScore(args.input);
    },

    deleteProductScore: async (
      _: any,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      AdminAuthService.requireAdmin(ctx.req);
      return AdminPricingRuleService.deleteProductScore(args.id);
    },
  },
};
