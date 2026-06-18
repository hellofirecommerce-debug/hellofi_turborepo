import { gql } from "@apollo/client";

const VIDEO_REVIEW_FIELDS = gql`
  fragment VideoReviewFields on VideoReview {
    id
    title
    videoUrl
    thumbnailUrl
    type
    priority
    isActive
    createdAt
    updatedAt
  }
`;

export const GET_VIDEO_REVIEWS = gql`
  ${VIDEO_REVIEW_FIELDS}
  query GetVideoReviews($type: VideoReviewType) {
    getVideoReviews(type: $type) {
      ...VideoReviewFields
    }
  }
`;
