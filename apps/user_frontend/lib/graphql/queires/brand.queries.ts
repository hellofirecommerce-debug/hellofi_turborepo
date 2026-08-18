import { gql } from "@apollo/client";

export const GET_IN_STOCK_BRANDS = gql`
  query GetInStockBrands($categorySlug: String) {
    getInStockBrands(categorySlug: $categorySlug) {
      id
      name
      seoName
      image
    }
  }
`;
