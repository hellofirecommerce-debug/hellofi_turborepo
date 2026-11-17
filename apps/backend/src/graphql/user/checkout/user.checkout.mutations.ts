export const mutations = `#graphql 
    createAddress(input: AddressInput!): Address!
    updateAddress(id: ID!, input: AddressInput!): Address!
    deleteAddress(id: ID!): Boolean!

    placeSellingOrder(orderNo: String!, input: PlaceOrderInput!): SellingOrder!
`;
