export const queries = `#graphql
  getInventoryProducts(filter: InventoryFilterInput): InventoryProductsResponse!
  getInventoryProductById(id: ID!): InventoryProduct!
  getInventoryProductByOrderId(orderId: String!): InventoryProduct
  getInventoryProductByImei(imeiOrSerial: String!): [InventoryProduct!]!
  searchProductNames(query: String!, categoryId: String, brandId: String, page: Int): ProductNameSearchResult!
  getAvailableForInvoice(search: String, brandId: String, categoryId: String, page: Int, pageSize: Int): AvailableForInvoiceResponse!
  getInventoryProductForInvoice(imeiOrSerial: String!): InventoryProductForInvoice!
`;
