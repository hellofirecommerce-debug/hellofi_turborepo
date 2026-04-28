export const typeDefs = `#graphql
  type Series {
    id: ID!
    brandId: String!
    categoryId: String!
    seriesName: String!
    status: String!
    priority: Int!
    brand: Brand
    category: Category
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SeriesResponse {
    items: [Series!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  input SeriesInput {
    brandId: String!
    categoryId: String!
    seriesName: String!
    status: String
    priority: Int
  }

  input UpdateSeriesInput {
    brandId: String
    categoryId: String
    seriesName: String
    status: String
    priority: Int
  }

  input SeriesFilterInput {
    search: String
    brandId: String
    categoryId: String
    page: Int
    pageSize: Int
  }
`;
