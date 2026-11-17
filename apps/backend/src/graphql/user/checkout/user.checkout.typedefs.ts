export const typeDefs = `#graphql
 enum AddressType {
    HOME
    WORK
    OTHER
  }

  enum PaymentMethod {
    UPI
    BANK
    CASH
  }

  enum PickupOption {
    DOORSTEP
    DROP_TO_OFFICE
  }

  type Address {
    id: ID!
    name: String!
    contact: String!
    alternateContactNo: String
    email: String!
    address: String!
    pinCode: String!
    landMark: String
    cityDistrict: String!
    state: String!
    gst: String
    addressType: AddressType!
    isDefault: Boolean!
  }

  input AddressInput {
    name: String!
    contact: String!
    alternateContactNo: String
    email: String!
    address: String!
    pinCode: String!
    landMark: String
    cityDistrict: String!
    state: String!
    gst: String
    addressType: AddressType!
    isDefault: Boolean
  }

  input SchedulePickupInput {
    method: PickupOption!
    date: String! # YYYY-MM-DD
    slot: String!
  }

  input PaymentInput {
    method: PaymentMethod!
    upiId: String
    bankName: String
    accountHolderName: String
    bankAccountNumber: String
    ifscCode: String
  }

  input PlaceOrderInput {
    addressId: ID!
    schedule: SchedulePickupInput!
    payment: PaymentInput!
    agreedToTerms: Boolean!
  }

  type PincodeCheck {
    serviceable: Boolean!
    city: String
    isDropToOfficeAvailable: Boolean!
  }
`;
