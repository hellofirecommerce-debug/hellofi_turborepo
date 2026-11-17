import { gql } from "@apollo/client";

export const GET_SELLING_ORDER = gql`
  query GetSellingOrder($orderNo: String!) {
    getSellingOrder(orderNo: $orderNo) {
      id
      orderNo
      orderStatus
      currentStep
      productName
      productImage
      brandName
      categoryName
      variantName
      basePrice
      quotedPriceBySystem
      pickupCharges
      processingFee
      totalAmount
    }
  }
`;
