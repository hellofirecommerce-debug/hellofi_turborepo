import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!, $image: Upload!) {
    createCategory(input: $input, image: $image) {
      id
      name
      seoName
      categoryType
      image
      status
      priority
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory(
    $updateCategoryId: ID!
    $input: CategoryInput!
    $image: Upload
  ) {
    updateCategory(id: $updateCategoryId, input: $input, image: $image) {
      categoryType
      createdAt
      id
      image
      name
      priority
      seoName
      status
      updatedAt
    }
  }
`;

export const DELETE_CATEOGRY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;
