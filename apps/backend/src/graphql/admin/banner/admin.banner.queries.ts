export const queries = `#graphql
  banners(placement: BannerPlacement): [Banner!]!
  activeBanners(placement: BannerPlacement!): [Banner!]!
`;
