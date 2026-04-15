export const mutations = `#graphql
    createCategory(
      input: CategoryInput!
      image: Upload!
    ): Category!

    updateCategory(
      id: ID!
      input: CategoryInput!
      image: Upload
    ): Category!

    deleteCategory(id: ID!): DeleteResponse!
`;
