import { gql } from "@apollo/client";

export const CREATE_OPTION = gql`
  mutation CreateOption(
    $input: CreateOptionInput!
    $image: Upload
    $resize: Boolean
  ) {
    createOption(input: $input, image: $image, resize: $resize) {
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
    $resize: Boolean
  ) {
    updateOption(
      input: $input
      image: $image
      removeImage: $removeImage
      resize: $resize
    ) {
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
