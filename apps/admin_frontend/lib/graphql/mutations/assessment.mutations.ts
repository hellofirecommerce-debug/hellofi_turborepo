import { gql } from "@apollo/client";

export const CREATE_ASSESSMENT = gql`
  mutation CreateAssessment($input: CreateAssessmentInput!) {
    createAssessment(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_ASSESSMENT = gql`
  mutation UpdateAssessment($input: UpdateAssessmentInput!) {
    updateAssessment(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_ASSESSMENT = gql`
  mutation DeleteAssessment($id: ID!) {
    deleteAssessment(id: $id) {
      message
      id
    }
  }
`;

export const CREATE_ASSESSMENT_STEP = gql`
  mutation CreateAssessmentStep($input: CreateAssessmentStepInput!) {
    createAssessmentStep(input: $input) {
      id
      stepName
    }
  }
`;

export const UPDATE_ASSESSMENT_STEP = gql`
  mutation UpdateAssessmentStep($input: UpdateAssessmentStepInput!) {
    updateAssessmentStep(input: $input) {
      id
      stepName
    }
  }
`;

export const DELETE_ASSESSMENT_STEP = gql`
  mutation DeleteAssessmentStep($id: ID!) {
    deleteAssessmentStep(id: $id) {
      message
      id
    }
  }
`;
