export const mutations = `#graphql
  createBanner(
    alt: String!
    redirectUrl: String
    placement: BannerPlacement!
    priority: Int!
    isActive: Boolean
    startDate: String
    endDate: String
    lgFile: Upload!
    smFile: Upload!
  ): Banner!

  updateBanner(
    id: ID!
    alt: String!
    redirectUrl: String
    placement: BannerPlacement!
    priority: Int!
    isActive: Boolean
    startDate: String
    endDate: String
    lgFile: Upload
    smFile: Upload
  ): Banner!

  deleteBanner(id: ID!): DeleteBannerResponse!
`;
