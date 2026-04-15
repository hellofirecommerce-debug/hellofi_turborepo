import { gql } from "@apollo/client";

export const GET_BRANDS = gql`
  query GetBrands {
    getBrands {
      id
      name
      seoName
      image
      createdAt
      updatedAt
      brandCategories {
        id
        categoryId
        status
        priority
        category {
          id
          name
        }
      }
    }
  }
`;

export const GET_BRANDS_BY_CATEGORY_ID = gql`
  query GetBrandsByCategoryId($categoryId: ID!) {
    getBrandsByCategoryId(categoryId: $categoryId) {
      id
      name
      seoName
      image
      createdAt
      updatedAt
      brandCategories {
        id
        categoryId
        status
        priority
        category {
          id
          name
        }
      }
    }
  }
`;
