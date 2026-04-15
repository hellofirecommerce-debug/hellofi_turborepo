export const typeDefs = `#graphql
   type DeleteResponse {
     id: ID!
     message: String!
    }

    input CategoryInput {
     name: String
     seoName: String
     categoryType: String
     priority: Int
  }
`;
