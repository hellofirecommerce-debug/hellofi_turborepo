import { gql } from "@apollo/client";

export const CREATE_INVENTORY_PRODUCT = gql`
  mutation CreateInventoryProduct($input: CreateInventoryProductInput!) {
    createInventoryProduct(input: $input) {
      id
      orderId
      productName
      status
      createdAt
    }
  }
`;

export const UPDATE_INVENTORY_PRODUCT = gql`
  mutation UpdateInventoryProduct($input: UpdateInventoryProductInput!) {
    updateInventoryProduct(input: $input) {
      id
      orderId
      productName
      status
      updatedAt
    }
  }
`;

export const MARK_AS_SOLD = gql`
  mutation MarkInventoryProductAsSold($input: MarkAsSoldInput!) {
    markInventoryProductAsSold(input: $input) {
      id
      status
      sellingPrice
      tat
      grossProfit
    }
  }
`;

export const DELETE_INVENTORY_PRODUCT = gql`
  mutation DeleteInventoryProduct($id: ID!) {
    deleteInventoryProduct(id: $id) {
      id
      message
    }
  }
`;
