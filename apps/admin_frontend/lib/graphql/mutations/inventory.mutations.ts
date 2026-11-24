import { gql } from "@apollo/client";

export const CREATE_INVENTORY_PRODUCT = gql`
  mutation CreateInventoryProduct(
    $input: CreateInventoryProductInput!
    $originalBill: Upload
  ) {
    createInventoryProduct(input: $input, originalBill: $originalBill) {
      id
      orderId
      productName
      status
      originalBill
      createdAt
    }
  }
`;

export const UPDATE_INVENTORY_PRODUCT = gql`
  mutation UpdateInventoryProduct(
    $input: UpdateInventoryProductInput!
    $originalBill: Upload
    $removeOriginalBill: Boolean
  ) {
    updateInventoryProduct(
      input: $input
      originalBill: $originalBill
      removeOriginalBill: $removeOriginalBill
    ) {
      id
      orderId
      productName
      status
      originalBill
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
