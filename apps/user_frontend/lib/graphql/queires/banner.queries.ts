import { gql } from "@apollo/client";

export const GET_ACTIVE_BANNER = gql`
  query ActiveBanner($placement: BannerPlacement!) {
    activeBanner(placement: $placement) {
      id
      alt
      lg
      sm
      redirectUrl
      placement
    }
  }
`;
