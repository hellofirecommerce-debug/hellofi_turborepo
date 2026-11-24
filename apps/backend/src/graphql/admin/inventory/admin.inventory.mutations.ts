export const mutations = `#graphql
  createInventoryProduct(input: CreateInventoryProductInput!, originalBill: Upload): InventoryProduct!
  updateInventoryProduct(input: UpdateInventoryProductInput!, originalBill: Upload, removeOriginalBill: Boolean): InventoryProduct!
  markInventoryProductAsSold(input: MarkAsSoldInput!): InventoryProduct!
  deleteInventoryProduct(id: ID!): DeleteResponse!
`;
