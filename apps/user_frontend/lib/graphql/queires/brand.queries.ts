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

export const GET_BRANDS_BY_CATEGORY = gql`
  query GetBrandsByCategorySeoName($categorySeoName: String!) {
    getBrandsByCategorySeoName(categorySeoName: $categorySeoName) {
      id
      name
      seoName
      image
    }
  }
`;
