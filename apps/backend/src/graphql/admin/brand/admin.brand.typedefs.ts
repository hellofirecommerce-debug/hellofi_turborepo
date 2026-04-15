export const typeDefs = `#graphql
input BrandCategoryItemInput {
  categoryId: ID!
  priority: Int!
  status: Status!
}

input BrandInput {
  name: String!
  seoName: String!
  brandCategories: [BrandCategoryItemInput!]!
}


  input BrandCategoryInput {
    brandId: ID
    categoryId: ID
    priority: Int
    status: Status
  }
`;
