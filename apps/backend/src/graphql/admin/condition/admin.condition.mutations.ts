export const mutations = `#graphql
  createCondition(input: CreateConditionInput!, image: Upload): SellingCondition!
  updateCondition(input: UpdateConditionInput!, image: Upload): SellingCondition!
  deleteCondition(id: ID!): DeleteResponse!
`;
