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

export const GET_SELLING_PRODUCT_BY_SEO_NAME = gql`
  query GetSellingProductBySeoName($seoName: String!) {
    getSellingProductBySeoName(seoName: $seoName) {
      id
      productName
      productSeoName
      image
      releasedYear
      productPrice
      hasVariants
      isConstantRam
      ram
      brand {
        seoName
      }
      variants {
        id
        ram
        storage
        productPrice
      }
    }
  }
`;
