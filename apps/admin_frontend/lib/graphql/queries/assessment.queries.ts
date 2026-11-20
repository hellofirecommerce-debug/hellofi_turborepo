import { gql } from "@apollo/client";

export const GET_ASSESSMENTS = gql`
  query GetAssessments($categoryId: String) {
    getAssessments(categoryId: $categoryId) {
      items {
        id
        name
        description
        totalSteps
        isActive
        categoryId
        category {
          id
          name
        }
      }
      total
    }
  }
`;

export const GET_ASSESSMENT_BY_ID = gql`
  query GetAssessmentById($id: ID!) {
    getAssessmentById(id: $id) {
      id
      name
      description
      totalSteps
      isActive
      category {
        id
        name
      }
      steps {
        id
        stepName
        stepCategory
        stepNumber
      }
    }
  }
`;

export const GET_STEPS = gql`
  query GetSteps($assessmentId: String) {
    getSteps(assessmentId: $assessmentId) {
      items {
        id
        stepName
        stepCategory
        stepNumber
        brandVisibilityStrategy
        assessment {
          id
          name
          categoryId
        }
      }
      total
    }
  }
`;

export const GET_STEP_BY_ID = gql`
  query GetStepById($id: ID!) {
    getStepById(id: $id) {
      id
      assessmentId
      stepCategory
      stepNumber
      stepName
      title
      subtitle
      description
      finalStepTitle
      priority
      brandVisibilityStrategy
      brandVisibility {
        id
        brandId
        brandName
        strategy
      }
    }
  }
`;
