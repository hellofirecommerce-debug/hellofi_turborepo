export const typeDefs = `#graphql
  enum ConditionType {
    BOOLEAN
    RADIO
    MULTI_SELECT
    MULTI_SELECT_INVERTED
    DROPDOWN
  }

  enum BrandVisibilityStrategy {
    INCLUDE
    EXCLUDE
    ALL
  }

  type BrandVisibility {
    id: ID!
    conditionId: String!
    strategy: BrandVisibilityStrategy!
    brandId: String
    brandName: String
  }

  type SellingCondition {
    id: ID!
    stepId: String!
    conditionType: ConditionType!
    title: String!
    subtitle: String
    description: String
    finalConditionName: String
    image: String
    icon: String
    isRequired: Boolean!
    priority: Int!
    applicableFromDate: String
    brandVisibilityStrategy: BrandVisibilityStrategy!

    # 👇 POPUP LOGIC
    parentOptionId: String
    parentOption: SellingOption

    step: AssessmentStep
    brandVisibility: [BrandVisibility!]!
    options: [SellingOption!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreateConditionInput {
    stepId: String!
    parentOptionId: String
    conditionType: ConditionType
    title: String!
    subtitle: String
    description: String
    finalConditionName: String
    image: String
    icon: String
    isRequired: Boolean
    priority: Int
    applicableFromDate: String
    brandVisibilityStrategy: BrandVisibilityStrategy
    brandVisibility: [BrandVisibilityInput!]
  }

  input UpdateConditionInput {
    id: ID!
    parentOptionId: String
    conditionType: ConditionType
    title: String
    subtitle: String
    description: String
    finalConditionName: String
    image: String
    icon: String
    isRequired: Boolean
    priority: Int
    applicableFromDate: String
    brandVisibilityStrategy: BrandVisibilityStrategy
    brandVisibility: [BrandVisibilityInput!]
  }

  input BrandVisibilityInput {
    brandId: String
    brandName: String
  }

  input ConditionFilterInput {
    stepId: String
    assessmentId: String
    categoryId: String
    search: String
    page: Int
    pageSize: Int
  }

  type ConditionListResponse {
    items: [SellingCondition!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }
`;
