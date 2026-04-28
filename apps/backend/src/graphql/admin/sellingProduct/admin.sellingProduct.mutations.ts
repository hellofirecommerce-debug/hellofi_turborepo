export const mutations = `#graphql
  createSellingProduct(input: CreateSellingProductInput!, image: Upload!): SellingProduct!
  updateSellingProduct(id: ID!, input: UpdateSellingProductInput!, image: Upload): SellingProduct!
  deleteSellingProduct(id: ID!): DeleteResponse!
`;
