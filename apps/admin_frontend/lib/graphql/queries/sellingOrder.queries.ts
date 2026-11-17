import { gql } from "@apollo/client";

export const GET_ADMIN_SELLING_ORDERS = gql`
  query AdminSellingOrders($filter: AdminOrderFilterInput) {
    adminSellingOrders(filter: $filter) {
      total
      page
      limit
      totalPages
      orders {
        id
        orderNo
        productName
        productImage
        brandName
        categoryName
        variantName
        listedPrice
        quotedPriceBySystem
        quotedPrice
        pickupCharges
        processingFee
        totalAmount
        orderStatus
        pickupMethod
        isDropToOffice
        isFullFilled
        followupStatus
        followupCount
        serialOrIMEI
        additionalNotes
        invoiceLink
        createdAt
        address {
          name
          contact
          address
          landMark
          cityDistrict
          state
          pinCode
        }
        user {
          id
          name
          phone
          pincode
        }
        timelineName
        timelineStatus
        timelineLabel
        timelineUpdatedAt
        deviceReport {
          stepId
          title
          items {
            conditionId
            question
            answer
          }
        }
      }
    }
  }
`;

export const GET_ADMIN_ORDER_CITIES = gql`
  query AdminOrderCities {
    adminOrderCities
  }
`;

export const GET_ADMIN_ORDER_TIMELINE = gql`
  query AdminOrderTimeline($orderNo: String!) {
    adminOrderTimeline(orderNo: $orderNo) {
      orderNo
      timelineName
      currentStatus
      steps {
        status
        label
        position
        state
      }
      events {
        status
        label
        message
        createdAt
      }
    }
  }
`;
