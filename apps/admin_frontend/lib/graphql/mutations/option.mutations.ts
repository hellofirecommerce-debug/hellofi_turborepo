import { gql } from "@apollo/client";

export const CREATE_OPTION = gql`
  mutation CreateOption($input: CreateOptionInput!, $image: Upload) {
    createOption(input: $input, image: $image) {
      id
      label
      image
    }
  }
`;

export const UPDATE_OPTION = gql`
  mutation UpdateOption(
    $input: UpdateOptionInput!
    $image: Upload
    $removeImage: Boolean
  ) {
    updateOption(input: $input, image: $image, removeImage: $removeImage) {
      id
      label
      image
    }
  }
`;

export const DELETE_OPTION = gql`
  mutation DeleteOption($id: ID!) {
    deleteOption(id: $id) {
      message
      id
    }
  }
`;
