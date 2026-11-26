import { gql } from "@apollo/client";

export const GET_SERVICEABLE_CITIES = gql`
  query GetServiceableCities {
    getServiceableCities
  }
`;
