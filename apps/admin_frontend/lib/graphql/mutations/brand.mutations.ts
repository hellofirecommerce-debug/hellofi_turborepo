import { gql } from "@apollo/client";

export const CREATE_BRAND = gql`
  mutation CreateBrand($input: BrandInput!, $image: Upload!) {
    createBrand(input: $input, image: $image) {
      createdAt
      id
      image
      name
      seoName
      updatedAt
      brandCategories {
        id
        categoryId
        status
        priority
        brandId
        category {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_BRAND = gql`
  mutation UpdateBrand(
    $updateBrandId: ID!
    $input: BrandInput!
    $image: Upload
  ) {
    updateBrand(id: $updateBrandId, input: $input, image: $image) {
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

export const DELETE_BRAND = gql`
  mutation DeleteBrand($id: ID!) {
    deleteBrand(id: $id) {
      id
      message
    }
  }
`;
