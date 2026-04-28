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
      hasMore
      names
    }
  }
`;

export const GET_INVENTORY_PRODUCT_FOR_INVOICE = gql`
  query GetInventoryProductForInvoice($imeiOrSerial: String!) {
    getInventoryProductForInvoice(imeiOrSerial: $imeiOrSerial) {
      id
      productName
      imeiOrSerial
      orderId
      ram
      storage
      costPrice
      otherCharges
      brandId
      categoryId
      status
      isEligible
      ineligibleReason
    }
  }
`;

export const GET_AVAILABLE_FOR_INVOICE = gql`
  query GetAvailableForInvoice($search: String, $page: Int, $pageSize: Int) {
    getAvailableForInvoice(search: $search, page: $page, pageSize: $pageSize) {
      items {
        id
        productName
        imeiOrSerial
        orderId
        ram
        storage
        status
      }
    }
  }
`;
