import { gql } from "@apollo/client";

export const GET_USER_ASSESSMENT_FLOW = gql`
  query GetUserAssessmentFlow(
    $categorySlug: String!
    $brandSlug: String!
    $productSlug: String!
  ) {
    getUserAssessmentFlow(
      categorySlug: $categorySlug
      brandSlug: $brandSlug
      productSlug: $productSlug
    ) {
      assessmentId
      assessmentName
      steps {
        id
        stepName
        stepCategory
        stepNumber
        title
        subtitle
        conditions {
          id
          title
          subtitle
          conditionType
          image
          icon
          isRequired
          options {
            id
            label
            image
            isRedirect
            redirectTo
            popupConditions {
              id
              title
              subtitle
              conditionType
              icon
              isRequired
              priority
              options {
                id
                label
                image
                priority
              }
            }
          }
        }
      }
    }
  }
`;
