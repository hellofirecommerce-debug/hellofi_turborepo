export const typedefs = `#graphql
  type Category {
    id: ID!
    name: String!
    seoName: String!
    categoryType: String!
    status:String!
    image: String!
    priority: Int!
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
