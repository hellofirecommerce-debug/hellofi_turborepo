export const mutations = `#graphql
  createOption(input: CreateOptionInput!, image: Upload, resize: Boolean): SellingOption!
  updateOption(input: UpdateOptionInput!, image: Upload, removeImage: Boolean, resize: Boolean): SellingOption!
  deleteOption(id: ID!): DeleteResponse!
`;
