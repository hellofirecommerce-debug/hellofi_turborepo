import { ApolloServer } from "@apollo/server";
import { sharedTypeDefs } from "./common/common.types";
import { AdminInventory } from "./admin/inventory";
import { AdminInvoiceSettings } from "./admin/invoiceSettings";
import { AdminBrand } from "./admin/brand";
import { AdminAuth } from "./admin/auth";
import { AdminCategory } from "./admin/category";
import { AdminSeries } from "./admin/series";
import { AdminSellingProduct } from "./admin/sellingProduct";
import { AdminBuyingProduct } from "./admin/buyingProduct";
import { CommonCategory } from "./common/category";
import { CommonBrand } from "./common/brand";
import { GraphQLUpload } from "graphql-upload-ts";
import { AdminInvoice } from "./admin/invoice";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

async function createApolloGraphqlServer() {
  const allTypeDefs = `

   ${sharedTypeDefs}

   type Query {

    # Common
    ${CommonCategory.queries}
    ${CommonBrand.queries}

    # Admin
    ${AdminAuth.queries}
    ${AdminCategory.queries}
    ${AdminInventory.queries}
    ${AdminInvoiceSettings.queries}
    ${AdminInvoice.queries}
    ${AdminSeries.queries}
    ${AdminSellingProduct.queries}
    ${AdminBuyingProduct.queries}
   } 

   type Mutation {
    # Admin
    ${AdminAuth.mutations}
    ${AdminCategory.mutations}
    ${AdminBrand.mutations}
    ${AdminInventory.mutations}
    ${AdminInvoiceSettings.mutations}
    ${AdminInvoice.mutations}
    ${AdminSeries.mutations}
    ${AdminSellingProduct.mutations}
    ${AdminBuyingProduct.mutations}
   }

    # Type Definitions
    ${AdminAuth.typeDefs}
    ${AdminCategory.typeDefs}
    ${AdminBrand.typeDefs}
    ${AdminInventory.typeDefs}
    ${AdminInvoiceSettings.typeDefs}
    ${AdminInvoice.typeDefs}
    ${AdminSeries.typeDefs}
    ${AdminSellingProduct.typeDefs}
    ${AdminBuyingProduct.typeDefs}


    # Common Category Typedefs
    ${CommonCategory.typedefs}
    ${CommonBrand.typedefs}
 
  `;

  const allResolvers = {
    Upload: GraphQLUpload,
    Query: {
      ...AdminAuth.resolvers.Query,
      ...AdminInventory.resolvers.Query,
      ...AdminInvoiceSettings.resolvers.Query,
      ...AdminInvoice.resolvers.Query,
      ...AdminSeries.resolvers.Query,
      ...AdminSellingProduct.resolvers.Query,
      ...AdminBuyingProduct.resolvers.Query,

      ...CommonCategory.resolvers.Query,
      ...CommonBrand.resolvers.Query,
    },

    Mutation: {
      ...AdminInventory.resolvers.Mutation,
      ...AdminBrand.resolvers.Mutation,
      ...AdminAuth.resolvers.Mutation,
      ...AdminCategory.resolvers.Mutation,
      ...AdminInvoiceSettings.resolvers.Mutation,
      ...AdminInvoice.resolvers.Mutation,
      ...AdminSeries.resolvers.Mutation,
      ...AdminSellingProduct.resolvers.Mutation,
      ...AdminBuyingProduct.resolvers.Mutation,
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
