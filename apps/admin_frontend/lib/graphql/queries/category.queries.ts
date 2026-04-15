import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      seoName
      categoryType
      image
      priority
      status
      createdAt
      updatedAt
    }
  }
`;
