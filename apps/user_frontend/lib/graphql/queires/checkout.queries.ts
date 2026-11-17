import { gql } from "@apollo/client";

export const GET_CHECKOUT_ORDER = gql`
  query GetCheckoutOrder($orderNo: String!) {
    getSellingOrder(orderNo: $orderNo) {
      orderNo
      orderStatus
      productName
      productImage
      brandName
      variantName
      totalAmount
      answers {
        conditionId
        question
        answer
      }
    }
  }
`;

export const GET_MY_ADDRESSES = gql`
  query GetMyAddresses {
    getMyAddresses {
      id
      name
      contact
      alternateContactNo
      email
      address
      pinCode
      landMark
      cityDistrict
      state
      gst
      addressType
      isDefault
    }
  }
`;

export const CHECK_PINCODE = gql`
  query CheckPincode($pinCode: String!) {
    checkPincode(pinCode: $pinCode) {
      serviceable
      city
      isDropToOfficeAvailable
    }
  }
`;
