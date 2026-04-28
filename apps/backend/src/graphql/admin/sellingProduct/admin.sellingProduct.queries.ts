export const queries = `#graphql
  getSellingProducts(filter: SellingProductFilterInput): SellingProductsResponse!
  getSellingProductById(id: ID!): SellingProduct!
`;
