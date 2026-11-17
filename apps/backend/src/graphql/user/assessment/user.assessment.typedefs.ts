export const typeDefs = `#graphql
  type UserSellingOption {
    id: ID!
    label: String!
    image: String
    isRedirect: Boolean!
    redirectTo: String
    priority: Int!
    popupConditions: [UserSellingCondition!]!
  }

  type UserSellingCondition {
    id: ID!
    title: String!
    subtitle: String
    description: String
    conditionType: String!
    image: String
    icon: String
    isRequired: Boolean!
    priority: Int!
    options: [UserSellingOption!]!
  }

  type UserAssessmentStep {
    id: ID!
    stepName: String!
    stepCategory: String!
    stepNumber: Int!
    title: String
    subtitle: String
    description: String
    conditions: [UserSellingCondition!]!
  }

  type UserAssessmentFlow {
    assessmentId: ID!
    assessmentName: String!
    steps: [UserAssessmentStep!]!
  }
`;
