// graphql/queries/brand.queries.ts
import { gql } from "@apollo/client";

export const GET_IN_STOCK_BRANDS = gql`
  query GetInStockBrands {
    getInStockBrands {
      id
      name
      seoName
      image
    }
  }
`;
