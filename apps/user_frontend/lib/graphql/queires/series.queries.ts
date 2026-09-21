import { gql } from "@apollo/client";

export const GET_SERIES_BY_BRAND = gql`
  query GetSeriesByBrandSeoName(
    $brandSeoName: String!
    $categorySeoName: String
  ) {
    getSeriesByBrandSeoName(
      brandSeoName: $brandSeoName
      categorySeoName: $categorySeoName
    ) {
      id
      seriesName
      priority
    }
  }
`;
