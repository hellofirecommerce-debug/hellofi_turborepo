export const mutations = `#graphql
  createConditionRule(input: CreateConditionRuleInput!): ConditionRule!
  updateConditionRule(input: UpdateConditionRuleInput!): ConditionRule!
  deleteConditionRule(id: ID!): DeleteResponse!

  createBrandScore(input: CreateBrandScoreInput!): OptionBrandScore!
  deleteBrandScore(id: ID!): DeleteResponse!

  createSeriesScore(input: CreateSeriesScoreInput!): OptionSeriesScore!
  deleteSeriesScore(id: ID!): DeleteResponse!

  createProductScore(input: CreateProductScoreInput!): OptionProductScore!
  deleteProductScore(id: ID!): DeleteResponse!
`;
