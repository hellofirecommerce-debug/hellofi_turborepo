export const typeDefs = `#graphql
  type SellingVariant {
    id: ID!
    sellingProductId: String!
    ram: String
    storage: String!
    productPrice: Float!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SellingProduct {
    id: ID!
    productName: String!
    productSeoName: String!
    brandId: String!
    categoryId: String!
    seriesId: String!
    image: String!
    releasedYear: Int
    launchedDate: DateTime
    productPrice: Float
    status: String!
    hasVariants: Boolean!
    isConstantRam: Boolean!
    ram: String
    brand: Brand
    category: Category
    series: Series
    variants: [SellingVariant!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SellingProductsResponse {
    items: [SellingProduct!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  input SellingVariantInput {
    ram: String
    storage: String!
    productPrice: Float!
    status: String
  }

  input CreateSellingProductInput {
    productName: String!
    productSeoName: String!
    brandId: String!
    categoryId: String!
    seriesId: String!
    releasedYear: Int
    launchedDate: String
    productPrice: Float
    status: String
    hasVariants: Boolean
    isConstantRam: Boolean
    ram: String
    variants: [SellingVariantInput!]
  }

  input UpdateSellingProductInput {
    productName: String
    productSeoName: String
    brandId: String
    categoryId: String
    seriesId: String
    releasedYear: Int
    launchedDate: String
    productPrice: Float
    status: String
    hasVariants: Boolean
    isConstantRam: Boolean
    ram: String
    variants: [SellingVariantInput!]
  }

  input SellingProductFilterInput {
    search: String
    brandId: String
    categoryId: String
    seriesId: String
    status: String
    page: Int
    pageSize: Int
  }
`;
