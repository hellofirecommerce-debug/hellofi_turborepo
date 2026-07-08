export const typeDefs = `#graphql
  enum BannerPlacement {
    HOME
    BUY_ALL
    BUY_MOBILE
    BUY_LAPTOP
    BUY_TABLET
    BUY_SMARTWATCH
    BUY_ACCESSORIES
    SELL_MOBILE
    SELL_LAPTOP
    SELL_TABLET
    SELL_SMARTWATCH
    SELL_ACCESSORIES
  }

  type Banner {
    id: ID!
    alt: String!
    lg: String!
    sm: String!
    redirectUrl: String
    placement: BannerPlacement!
    priority: Int!
    isActive: Boolean!
    startDate: String
    endDate: String
    createdAt: String!
    updatedAt: String!
  }

  type DeleteBannerResponse {
    message: String!
    id: String!
  }
`;
