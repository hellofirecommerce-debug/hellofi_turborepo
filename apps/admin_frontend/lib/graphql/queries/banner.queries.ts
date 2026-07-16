import { gql } from "@apollo/client";

export const GET_BANNERS = gql`
  query Banners {
    banners {
      id
      alt
      lg
      sm
      redirectUrl
      placement
      priority
      isActive
      createdAt
    }
  }
`;
