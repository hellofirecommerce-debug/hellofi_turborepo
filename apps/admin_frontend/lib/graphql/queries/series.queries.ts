import { gql } from "@apollo/client";

export const GET_SERIES = gql`
  query GetSeries($filter: SeriesFilterInput) {
    getSeries(filter: $filter) {
      items {
        id
        brandId
        categoryId
        seriesName
        status
        priority
        brand {
          id
          name
        }
        category {
          id
          name
        }
        createdAt
        updatedAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_SERIES_BY_ID = gql`
  query GetSeriesById($id: ID!) {
    getSeriesById(id: $id) {
      id
      brandId
      categoryId
      seriesName
      status
      priority
      brand {
        id
        name
      }
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;
