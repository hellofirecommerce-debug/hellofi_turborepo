import { gql } from "@apollo/client";

const ADDRESS_FIELDS = `
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
`;

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: AddressInput!) {
    createAddress(input: $input) {
      ${ADDRESS_FIELDS}
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: ID!, $input: AddressInput!) {
    updateAddress(id: $id, input: $input) {
      ${ADDRESS_FIELDS}
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id)
  }
`;

export const PLACE_SELLING_ORDER = gql`
  mutation PlaceSellingOrder($orderNo: String!, $input: PlaceOrderInput!) {
    placeSellingOrder(orderNo: $orderNo, input: $input) {
      orderNo
      orderStatus
    }
  }
`;
