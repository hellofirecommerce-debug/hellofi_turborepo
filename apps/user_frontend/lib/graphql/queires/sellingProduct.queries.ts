import { gql } from "@apollo/client";

export const GET_SELLING_PRODUCTS_BY_BRAND = gql`
  query GetSellingProductsByBrand(
    $brandSeoName: String!
    $categorySeoName: String!
    $skip: Int
    $take: Int
  ) {
    getSellingProductsByBrand(
      brandSeoName: $brandSeoName
      categorySeoName: $categorySeoName
      skip: $skip
      take: $take
    ) {
      items {
        id
        productName
        productSeoName
        image
        releasedYear
        series {
          id
          seriesName
          priority
        }
      }
      hasMore
    }
  }
`;
