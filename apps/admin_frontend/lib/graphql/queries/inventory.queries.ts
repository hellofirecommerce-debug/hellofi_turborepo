import { gql } from "@apollo/client";

export const GET_INVENTORY_PRODUCTS = gql`
  query GetInventoryProducts($filter: InventoryFilterInput) {
    getInventoryProducts(filter: $filter) {
      items {
        id
        imeiOrSerial
        orderId
        brandId
        categoryId
        purchaseDate
        productName
        ram
        storage
        costPrice
        otherCharges
        customerName
        customerEmail
        customerPhone
        customerAddress
        status

        # Selling Details
        sellingDate
        sellingPrice
        invoice
        sellingOtherCharges
        sellingCustomerName
        sellingCustomerEmail
        sellingCustomerPhone
        sellingCustomerAddress
        paymentMode
        receivedInBank
        splitPaymentDetails

        # Business Metrics
        tat
        grossProfit

        # Device Condition
        screenCondition
        bodyCondition
        deviceIssues

        # Accessories
        hasBox
        hasCharger
        hasOriginalBill

        # Warranty
        warrantyType
        warrantyPurchaseDate

        # Metadata
        isActive
        notes
        createdAt
        updatedAt

        brand {
          id
          name
          image
        }
        category {
          id
          name
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_INVENTORY_PRODUCT_BY_ID = gql`
  query GetInventoryProductById($id: ID!) {
    getInventoryProductById(id: $id) {
      id
      imeiOrSerial
      orderId
      brandId
      categoryId
      purchaseDate
      productName
      ram
      storage
      costPrice
      otherCharges
      customerName
      customerEmail
      customerPhone
      customerAddress
      status
      sellingDate
      sellingPrice
      invoice
      sellingCustomerName
      sellingCustomerEmail
      sellingCustomerPhone
      sellingCustomerAddress
      paymentMode
      receivedInBank
      splitPaymentDetails
      tat
      grossProfit
      isActive
      notes
      screenCondition
      bodyCondition
      deviceIssues
      hasBox
      hasCharger
      hasOriginalBill
      warrantyType
      warrantyPurchaseDate
      createdAt
      updatedAt
      brand {
        id
        name
        image
      }
      category {
        id
        name
      }
    }
  }
`;

export const SEARCH_PRODUCT_NAMES = gql`
  query SearchProductNames(
    $query: String!
    $categoryId: String
    $brandId: String
    $page: Int
  ) {
    searchProductNames(
      query: $query
      categoryId: $categoryId
      brandId: $brandId
      page: $page
    ) {
      names
      hasMore
    }
  }
`;
