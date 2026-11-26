import { ApolloServer } from "@apollo/server";
import { sharedTypeDefs } from "./common/common.types";
import { AdminInventory } from "./admin/inventory";
import { AdminInvoiceSettings } from "./admin/invoiceSettings";
import { AdminBrand } from "./admin/brand";
import { AdminAuth } from "./admin/auth";
import { AdminCategory } from "./admin/category";
import { AdminBanner } from "./admin/banner";
import { AdminSeries } from "./admin/series";
import { AdminSellingProduct } from "./admin/sellingProduct";
import { AdminBuyingProduct } from "./admin/buyingProduct";
import { AdminVideoReviews } from "./admin/video-review";

import { CommonCategory } from "./common/category";
import { CommonBrand } from "./common/brand";
import { CommonBuyingProduct } from "./common/buyingProduct";
import { CommonServiceablePincode } from "./common/serviceablePincode";

import { GraphQLUpload } from "graphql-upload-ts";
import { AdminInvoice } from "./admin/invoice";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import { UserBuyingProduct } from "./user/buyingProduct";
import { UserBrand } from "./user/brand";
import { UserSellingProduct } from "./user/sellingProduct";
import { UserSeries } from "./user/series";
import { UserAssessment } from "./user/assessment";
import { UserAuth } from "./user/auth";
import { UserSellingOrder } from "./user/sellingOrder";
import { UserCheckout } from "./user/checkout";

import { AdminAssessment } from "./admin/assessment";
import { AdminCondition } from "./admin/condition";
import { AdminOption } from "./admin/option";
import { AdminPricingRule } from "./admin/pricingRule";
import { AdminSellingOrder } from "./admin/sellingOrder";

async function createApolloGraphqlServer() {
  const allTypeDefs = `

   ${sharedTypeDefs}

   type Query {

    # Common
    ${CommonCategory.queries}
    ${CommonBrand.queries}
    ${CommonServiceablePincode.queries}

    # Admin
    ${AdminBanner.queries}
    ${AdminAuth.queries}
    ${AdminCategory.queries}
    ${AdminInventory.queries}
    ${AdminInvoiceSettings.queries}
    ${AdminInvoice.queries}
    ${AdminSeries.queries}
    ${AdminSellingProduct.queries}
    ${AdminBuyingProduct.queries}
    ${AdminVideoReviews.queries}
    ${AdminAssessment.queries}
    ${AdminCondition.queries}
    ${AdminOption.queries}
    ${AdminPricingRule.queries}
    ${AdminSellingOrder.queries}


    #user
    ${UserBuyingProduct.queries}
    ${UserBrand.queries}
    ${UserSeries.queries}
    ${UserSellingProduct.queries}
    ${UserAssessment.queries}
    ${UserSellingOrder.queries}
    ${UserAuth.queries}
    ${UserCheckout.queries}
   } 

   type Mutation {
    # Admin
    ${AdminBanner.mutations}
    ${AdminAuth.mutations}
    ${AdminCategory.mutations}
    ${AdminBrand.mutations}
    ${AdminInventory.mutations}
    ${AdminInvoiceSettings.mutations}
    ${AdminInvoice.mutations}
    ${AdminSeries.mutations}
    ${AdminSellingProduct.mutations}
    ${AdminBuyingProduct.mutations}
    ${AdminVideoReviews.mutations}
    ${AdminAssessment.mutations}
    ${AdminCondition.mutations}
    ${AdminOption.mutations}
    ${AdminPricingRule.mutations}
    ${AdminSellingOrder.mutations}


    ${UserSellingOrder.mutations}
    ${UserAuth.mutations}
    ${UserCheckout.mutations}

   }

    # Type Definitions
    ${AdminBanner.typeDefs}
    ${AdminAuth.typeDefs}
    ${AdminCategory.typeDefs}
    ${AdminBrand.typeDefs}
    ${AdminInventory.typeDefs}
    ${AdminInvoiceSettings.typeDefs}
    ${AdminInvoice.typeDefs}
    ${AdminSeries.typeDefs}
    ${AdminSellingProduct.typeDefs}
    ${AdminBuyingProduct.typeDefs}
    ${AdminVideoReviews.typeDefs}
    ${AdminAssessment.typeDefs}
    ${AdminCondition.typeDefs}
    ${AdminOption.typeDefs}
    ${AdminPricingRule.typeDefs}
    ${AdminSellingOrder.typeDefs}

    # user
    ${UserBuyingProduct.typeDefs}
    ${UserSellingProduct.typeDefs}
    ${UserAssessment.typeDefs}
    ${UserAuth.typeDefs}
    ${UserSellingOrder.typeDefs}
    ${UserCheckout.typeDefs}

    # Common Category Typedefs
    ${CommonCategory.typedefs}
    ${CommonBrand.typedefs}
    ${CommonBuyingProduct.typeDefs}
 
  `;

  const allResolvers = {
    Upload: GraphQLUpload,
    Query: {
      ...AdminBanner.resolvers.Query,
      ...AdminAuth.resolvers.Query,
      ...AdminInventory.resolvers.Query,
      ...AdminInvoiceSettings.resolvers.Query,
      ...AdminInvoice.resolvers.Query,
      ...AdminSeries.resolvers.Query,
      ...AdminSellingProduct.resolvers.Query,
      ...AdminBuyingProduct.resolvers.Query,
      ...AdminVideoReviews.resolvers.Query,
      ...AdminAssessment.resolvers.Query,
      ...AdminCondition.resolvers.Query,
      ...AdminOption.resolvers.Query,
      ...AdminPricingRule.resolvers.Query,
      ...AdminSellingOrder.resolvers.Query,

      ...CommonCategory.resolvers.Query,
      ...CommonBrand.resolvers.Query,
      ...CommonServiceablePincode.resolvers.Query,

      ...UserBuyingProduct.resolvers.Query,
      ...UserBrand.resolvers.Query,
      ...UserSeries.resolvers.Query,
      ...UserSellingProduct.resolvers.Query,
      ...UserAssessment.resolvers.Query,
      ...UserSellingOrder.resolvers.Query,
      ...UserAuth.resolvers.Query,
      ...UserCheckout.resolvers.Query,
    },

    Mutation: {
      ...AdminBanner.resolvers.Mutation,
      ...AdminInventory.resolvers.Mutation,
      ...AdminBrand.resolvers.Mutation,
      ...AdminAuth.resolvers.Mutation,
      ...AdminCategory.resolvers.Mutation,
      ...AdminInvoiceSettings.resolvers.Mutation,
      ...AdminInvoice.resolvers.Mutation,
      ...AdminSeries.resolvers.Mutation,
      ...AdminSellingProduct.resolvers.Mutation,
      ...AdminBuyingProduct.resolvers.Mutation,
      ...AdminVideoReviews.resolvers.Mutation,
      ...AdminAssessment.resolvers.Mutation,
      ...AdminCondition.resolvers.Mutation,
      ...AdminOption.resolvers.Mutation,
      ...AdminPricingRule.resolvers.Mutation,
      ...AdminSellingOrder.resolvers.Mutation,

      ...UserAuth.resolvers.Mutation,
      ...UserSellingOrder.resolvers.Mutation,
      ...UserCheckout.resolvers.Mutation,
    },
  };

  const graphqlServer = new ApolloServer({
    typeDefs: allTypeDefs,
    resolvers: allResolvers,
    // ── Disable sandbox in production ──
    introspection: process.env.NODE_ENV !== "production",
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await graphqlServer.start();

  return graphqlServer;
}

export default createApolloGraphqlServer;
