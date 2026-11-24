export const mutations = `#graphql
  createInventoryProduct(input: CreateInventoryProductInput!, originalBills: [Upload!]): InventoryProduct!
  updateInventoryProduct(input: UpdateInventoryProductInput!, originalBills: [Upload!], removeOriginalBillIds: [ID!]): InventoryProduct!
  markInventoryProductAsSold(input: MarkAsSoldInput!): InventoryProduct!
  deleteInventoryProduct(id: ID!): DeleteResponse!
  deleteInventoryProducts(ids: [ID!]!): BulkDeleteInventoryResponse!
`;
