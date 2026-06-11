export const typeDefs = `#graphql
  enum VideoReviewType {
    BUY
    SELL
    HOME
  }

  type VideoReview {
    id: ID!
    title: String
    videoUrl: String!
    thumbnailUrl: String!
    type: VideoReviewType!
    priority: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateVideoReviewInput {
    title: String
    type: VideoReviewType!
    priority: Int
  }

  input UpdateVideoReviewInput {
    title: String
    type: VideoReviewType
    priority: Int
    isActive: Boolean
  }
`;
