import { gql } from "@apollo/client";

export const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($orderNo: String!) {
    getSellingOrder(orderNo: $orderNo) {
      orderNo
      orderStatus
      createdAt
      productName
      productImage
      brandName
      variantName
      totalAmount
      isDropToOffice
      pickupISODate
      pickupSlot
      dropToOfficeISODate
      dropToOfficeSlotTimings
      paymentMethod
      address {
        name
        contact
        address
        landMark
        cityDistrict
        state
        pinCode
      }
      answers {
        conditionId
        question
        answer
      }
    }
  }
`;
