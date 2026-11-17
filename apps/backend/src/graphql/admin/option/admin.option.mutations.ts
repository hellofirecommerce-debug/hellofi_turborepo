export const mutations = `#graphql
  createOption(input: CreateOptionInput!, image: Upload): SellingOption!
  updateOption(input: UpdateOptionInput!, image: Upload, removeImage: Boolean): SellingOption!
  deleteOption(id: ID!): DeleteResponse!
`;
