import { gql } from "@apollo/client";

export const CREATE_BANNER = gql`
  mutation CreateBanner(
    $alt: String!
    $redirectUrl: String
    $placement: BannerPlacement!
    $priority: Int!
    $lgFile: Upload!
    $smFile: Upload!
  ) {
    createBanner(
      alt: $alt
      redirectUrl: $redirectUrl
      placement: $placement
      priority: $priority
      lgFile: $lgFile
      smFile: $smFile
    ) {
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

export const DELETE_BANNER = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id) {
      message
      id
    }
  }
`;

export const UPDATE_BANNER = gql`
  mutation UpdateBanner(
    $id: ID!
    $alt: String!
    $redirectUrl: String
    $placement: BannerPlacement!
    $priority: Int!
    $lgFile: Upload
    $smFile: Upload
  ) {
    updateBanner(
      id: $id
      alt: $alt
      redirectUrl: $redirectUrl
      placement: $placement
      priority: $priority
      lgFile: $lgFile
      smFile: $smFile
    ) {
      id
    }
  }
`;
