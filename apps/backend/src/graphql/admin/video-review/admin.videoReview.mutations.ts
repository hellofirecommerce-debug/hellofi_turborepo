export const mutations = `#graphql
  createVideoReview(
    input: CreateVideoReviewInput!
    video: Upload!
    thumbnail: Upload!
  ): VideoReview!

  updateVideoReview(
    id: ID!
    input: UpdateVideoReviewInput!
    video: Upload
    thumbnail: Upload
  ): VideoReview!

  deleteVideoReview(id: ID!): DeleteResponse!
`;
