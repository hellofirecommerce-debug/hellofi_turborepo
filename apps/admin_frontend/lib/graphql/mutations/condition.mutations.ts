import { gql } from "@apollo/client";

export const CREATE_CONDITION = gql`
  mutation CreateCondition($input: CreateConditionInput!, $image: Upload) {
    createCondition(input: $input, image: $image) {
      id
      title
      image
      parentOptionId # 👈 Add this
    }
  }
`;

export const UPDATE_CONDITION = gql`
  mutation UpdateCondition($input: UpdateConditionInput!, $image: Upload) {
    updateCondition(input: $input, image: $image) {
      id
      title
      image
      parentOptionId # 👈 Add this
    }
  }
`;

export const DELETE_CONDITION = gql`
  mutation DeleteCondition($id: ID!) {
    deleteCondition(id: $id) {
      message
      id
    }
  }
`;
