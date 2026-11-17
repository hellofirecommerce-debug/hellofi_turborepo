export const queries = `#graphql
  getConditionRules(filter: ConditionRuleFilterInput): ConditionRuleListResponse!
  getConditionRuleById(id: ID!): ConditionRule!
`;
