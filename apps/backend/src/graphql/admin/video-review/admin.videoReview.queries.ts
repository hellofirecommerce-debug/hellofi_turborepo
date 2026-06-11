export const queries = `#graphql
  getVideoReviews(type: VideoReviewType): [VideoReview!]!
  getVideoReviewById(id: ID!): VideoReview!
`;
