export const queries = `#graphql
  getSeries(filter: SeriesFilterInput): SeriesResponse!
  getSeriesById(id: ID!): Series!
`;
