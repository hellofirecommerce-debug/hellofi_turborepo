export const mutations = `#graphql
  createInventoryProduct(input: CreateInventoryProductInput!): InventoryProduct!
  updateInventoryProduct(input: UpdateInventoryProductInput!): InventoryProduct!
  markInventoryProductAsSold(input: MarkAsSoldInput!): InventoryProduct!
  deleteInventoryProduct(id: ID!): DeleteResponse!
`;
