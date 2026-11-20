export const typeDefs = `#graphql
  enum StepCategory {
    BASICS
    DEVICE_DEFECTS
    COSMETIC_CONDITION
    ACCESSORIES
    LAPTOP_SYSTEM_CONFIG
    SPECIFICATION
    PRICING
  }

  type Assessment {
    id: ID!
    categoryId: String!
    name: String!
    description: String
    totalSteps: Int!
    isActive: Boolean!
    category: Category
    steps: [AssessmentStep!]!
    createdAt: String!
    updatedAt: String!
  }

  type AssessmentStep {
    id: ID!
    assessmentId: String!
    stepCategory: StepCategory!
    stepNumber: Int!
    stepName: String!
    title: String
    subtitle: String
    description: String
    finalStepTitle: String
    priority: Int!
    brandVisibilityStrategy: BrandVisibilityStrategy!
    brandVisibility: [BrandVisibility!]!
    assessment: Assessment
    conditions: [SellingCondition!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreateAssessmentInput {
    categoryId: String!
    name: String!
    description: String
  }

  input UpdateAssessmentInput {
    id: ID!
    name: String
    description: String
  }

  input CreateAssessmentStepInput {
    assessmentId: String!
    stepCategory: StepCategory!
    stepNumber: Int!
    stepName: String!
    title: String
    subtitle: String
    description: String
    finalStepTitle: String
    priority: Int
    brandVisibilityStrategy: BrandVisibilityStrategy
    brandVisibility: [BrandVisibilityInput!]
  }

  input UpdateAssessmentStepInput {
    id: ID!
    stepCategory: StepCategory
    stepNumber: Int
    stepName: String
    title: String
    subtitle: String
    description: String
    finalStepTitle: String
    priority: Int
    brandVisibilityStrategy: BrandVisibilityStrategy
    brandVisibility: [BrandVisibilityInput!]
  }

  type AssessmentListResponse {
    items: [Assessment!]!
    total: Int!
  }

  type AssessmentStepListResponse {
    items: [AssessmentStep!]!
    total: Int!
  }
`;
