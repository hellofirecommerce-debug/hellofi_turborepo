export const queries = `#graphql
  getBuyingProducts(filter: BuyingProductFilterInput): BuyingProductsResponse!
  getBuyingProductById(id: ID!): BuyingProduct!
`;
