export const queries = `#graphql
  banners(placement: BannerPlacement): [Banner!]!
  activeBanner(placement: BannerPlacement!): Banner
`;
