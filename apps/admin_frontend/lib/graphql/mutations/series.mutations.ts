import { gql } from "@apollo/client";

export const CREATE_SERIES = gql`
  mutation CreateSeries($input: SeriesInput!) {
    createSeries(input: $input) {
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

export const UPDATE_SERIES = gql`
  mutation UpdateSeries($id: ID!, $input: UpdateSeriesInput!) {
    updateSeries(id: $id, input: $input) {
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

export const DELETE_SERIES = gql`
  mutation DeleteSeries($id: ID!) {
    deleteSeries(id: $id) {
      id
      message
    }
  }
`;
