export const queries = `#graphql
  getBrands: [Brand!]
  getBrandById(id: ID!): Brand!
  getBrandsByCategorySeoName(categorySeoName: String!): [Brand!]
  getBrandsByCategoryId(categoryId: ID!):[Brand!]
`;
