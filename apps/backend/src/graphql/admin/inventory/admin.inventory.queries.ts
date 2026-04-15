export const queries = `#graphql
  getInventoryProducts(filter: InventoryFilterInput): InventoryProductsResponse!
  getInventoryProductById(id: ID!): InventoryProduct!
  getInventoryProductByOrderId(orderId: String!): InventoryProduct
  getInventoryProductByImei(imeiOrSerial: String!): [InventoryProduct!]!
`;
