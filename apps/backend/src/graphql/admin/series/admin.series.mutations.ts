export const mutations = `#graphql
  createSeries(input: SeriesInput!): Series!
  updateSeries(id: ID!, input: UpdateSeriesInput!): Series!
  deleteSeries(id: ID!): DeleteResponse!
`;
