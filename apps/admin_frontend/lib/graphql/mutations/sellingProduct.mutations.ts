import { gql } from "@apollo/client";

export const CREATE_SELLING_PRODUCT = gql`
  mutation CreateSellingProduct(
    $input: CreateSellingProductInput!
    $image: Upload!
  ) {
    createSellingProduct(input: $input, image: $image) {
      id
      productName
      productSeoName
      status
      hasVariants
      isConstantRam
      ram
      brand {
        id
        name
      }
      category {
        id
        name
      }
      series {
        id
        seriesName
      }
      variants {
        id
        ram
        storage
        productPrice
        status
      }
      createdAt
    }
  }
`;

export const UPDATE_SELLING_PRODUCT = gql`
  mutation UpdateSellingProduct(
    $id: ID!
    $input: UpdateSellingProductInput!
    $image: Upload
  ) {
    updateSellingProduct(id: $id, input: $input, image: $image) {
      id
      productName
      productSeoName
      status
      hasVariants
      isConstantRam
      ram
      image
      brand {
        id
        name
      }
      category {
        id
        name
      }
      series {
        id
        seriesName
      }
      variants {
        id
        ram
        storage
        productPrice
        status
      }
      updatedAt
    }
  }
`;

export const DELETE_SELLING_PRODUCT = gql`
  mutation DeleteSellingProduct($id: ID!) {
    deleteSellingProduct(id: $id) {
      id
      message
    }
  }
`;
