export const typedefs = `#graphql
  type Brand {
    id: ID!
    name: String!
    seoName: String!
    image: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    brandCategories: [BrandCategory]
  }       

   type BrandCategory {
    id: ID!
    brandId: ID!
    categoryId: ID!
    status: Status
    priority: Int
    createdAt: DateTime
    updatedAt: DateTime
    brand: Brand
    category: Category
  }
`;
