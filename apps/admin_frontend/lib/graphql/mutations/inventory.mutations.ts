import { gql } from "@apollo/client";

export const CREATE_INVENTORY_PRODUCT = gql`
  mutation CreateInventoryProduct(
    $input: CreateInventoryProductInput!
    $originalBills: [Upload!]
  ) {
    createInventoryProduct(input: $input, originalBills: $originalBills) {
      id
      orderId
      productName
      status
      originalBills {
        id
        fileName
      }
      createdAt
    }
  }
`;

export const UPDATE_INVENTORY_PRODUCT = gql`
  mutation UpdateInventoryProduct(
    $input: UpdateInventoryProductInput!
    $originalBills: [Upload!]
    $removeOriginalBillIds: [ID!]
  ) {
    updateInventoryProduct(
      input: $input
      originalBills: $originalBills
      removeOriginalBillIds: $removeOriginalBillIds
    ) {
      id
      orderId
      productName
      status
      originalBills {
        id
        fileName
      }
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

export const DELETE_INVENTORY_PRODUCTS = gql`
  mutation DeleteInventoryProducts($ids: [ID!]!) {
    deleteInventoryProducts(ids: $ids) {
      deletedCount
      skippedCount
      message
      skipped {
        id
        orderId
        reason
      }
    }
  }
`;
