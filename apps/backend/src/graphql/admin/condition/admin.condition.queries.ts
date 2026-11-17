export const queries = `#graphql
  getConditions(filter: ConditionFilterInput): ConditionListResponse!
  getConditionById(id: ID!): SellingCondition!
`;
