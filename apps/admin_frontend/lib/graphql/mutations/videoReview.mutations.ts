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

export const CREATE_VIDEO_REVIEW = gql`
  ${VIDEO_REVIEW_FIELDS}
  mutation CreateVideoReview(
    $input: CreateVideoReviewInput!
    $video: Upload!
    $thumbnail: Upload!
  ) {
    createVideoReview(input: $input, video: $video, thumbnail: $thumbnail) {
      ...VideoReviewFields
    }
  }
`;

export const UPDATE_VIDEO_REVIEW = gql`
  ${VIDEO_REVIEW_FIELDS}
  mutation UpdateVideoReview(
    $id: ID!
    $input: UpdateVideoReviewInput!
    $video: Upload
    $thumbnail: Upload
  ) {
    updateVideoReview(
      id: $id
      input: $input
      video: $video
      thumbnail: $thumbnail
    ) {
      ...VideoReviewFields
    }
  }
`;

export const DELETE_VIDEO_REVIEW = gql`
  mutation DeleteVideoReview($id: ID!) {
    deleteVideoReview(id: $id) {
      id
      message
    }
  }
`;
