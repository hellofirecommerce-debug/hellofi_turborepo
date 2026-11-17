export const typeDefs = `#graphql
  type PriceBreakdownLine {
    stepId: ID!
    stepName: String!
    conditionId: ID!
    conditionTitle: String!
    optionId: ID!
    optionLabel: String!
    score: Int!
    scoreType: String!
    action: String!
    appliedValue: Float!
  }

  type QuoteResult {
    productId: ID!
    variantId: ID
    basePrice: Float!
    finalQuote: Float!
    breakdown: [PriceBreakdownLine!]!
    totalDeduction: Float!
    totalAddition: Float!
  }

  input SelectedAnswerInput {
    stepId: ID!
    conditionId: ID!
    optionId: ID!
  }

  input CreateSellingOrderInput {
    productId: ID!
    variantId: ID
    answers: [SelectedAnswerInput!]!
  }

  type CreateSellingOrderPayload {
    orderId: ID!
    orderNo: String!
    orderLink: String!
    quote: QuoteResult!
    status: String!
  }

  type SellingOrderResponse {
    id: ID!
    orderNo: String!
    productName: String!
    totalAmount: Float!
    orderStatus: String!
  }

  type OrderAddress {
  name: String
  contact: String
  address: String
  landMark: String
  cityDistrict: String
  state: String
  pinCode: String
}

  # typeDefs
  type OrderAnswer {
  conditionId: ID!
  question: String!
  answer: String!
}

type SellingOrder {
  id: ID!
  orderNo: String!
  orderStatus: String!
  currentStep: Int!
  productName: String!
  productImage: String
  brandName: String
  categoryName: String
  variantName: String
  basePrice: Float
  quotedPriceBySystem: Float
  pickupCharges: Float
  processingFee: Float
  totalAmount: Float

  # checkout
  addressId: ID
  serviceAvailable: Boolean!
  pickupMethod: String
  isDropToOffice: Boolean!
  pickupDate: String
  pickupSlot: String
  dropToOfficeDate: String
  dropToOfficeSlotTimings: String
  paymentMethod: PaymentMethod
  isAgreedToTerms: Boolean!

  # what the user answered, with names instead of IDs
  answers: [OrderAnswer!]!
  createdAt: String!
  address: OrderAddress
  pickupISODate: String
  dropToOfficeISODate: String
}
`;
