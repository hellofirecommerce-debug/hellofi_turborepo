export const queries = `#graphql
  getOptions(filter: OptionFilterInput): OptionListResponse!
  getOptionById(id: ID!): SellingOption!
`;
