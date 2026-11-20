export const typeDefs = `#graphql
  enum OptionAction {
    INCREMENT
    DECREMENT
    REDIRECT
    NONE
  }

  enum ScoreType {
    PER
    RUPPEE
    MUL
  }

  type SellingOption {
    id: ID!
    conditionId: String!
    label: String!
    action: OptionAction!
    score: Int!
    scoreType: ScoreType!
    isRedirect: Boolean!
    redirectTo: String
    priority: Int!
    title: String
    description: String
    isSelected: Boolean!
    image: String
    brandVisibilityStrategy: BrandVisibilityStrategy!
    brandVisibility: [BrandVisibility!]!

    # POPUP LOGIC
    popupConditions: [SellingCondition!]!

    condition: SellingCondition
    brandScores: [OptionBrandScore!]!
    seriesScores: [OptionSeriesScore!]!
    productScores: [OptionProductScore!]!
    createdAt: String!
    updatedAt: String!
  }

  type OptionBrandScore {
    id: ID!
    optionId: String!
    brandId: String!
    brandName: String
    score: Int!
    scoreType: ScoreType!
    action: OptionAction!
  }

  type OptionSeriesScore {
    id: ID!
    optionId: String!
    seriesId: String!
    seriesName: String
    score: Int!
    scoreType: ScoreType!
    action: OptionAction!
  }

  type OptionProductScore {
    id: ID!
    optionId: String!
    productId: String!
    productName: String
    score: Int!
    scoreType: ScoreType!
    action: OptionAction!
  }

  input CreateOptionInput {
    conditionId: String!
    label: String!
    action: OptionAction
    score: Int
    scoreType: ScoreType
    isRedirect: Boolean
    redirectTo: String
    priority: Int
    title: String
    description: String
    image: String
    brandVisibilityStrategy: BrandVisibilityStrategy
    brandVisibility: [BrandVisibilityInput!]
  }

  input UpdateOptionInput {
    id: ID!
    conditionId: String
    label: String
    action: OptionAction
    score: Int
    scoreType: ScoreType
    isRedirect: Boolean
    redirectTo: String
    priority: Int
    title: String
    description: String
    image: String
    brandVisibilityStrategy: BrandVisibilityStrategy
    brandVisibility: [BrandVisibilityInput!]
  }

  input OptionFilterInput {
    categoryId: String
    assessmentId: String
    stepId: String
    conditionId: String
    search: String
    page: Int
    pageSize: Int
    sortBy: String
    sortOrder: String
  }

  type OptionListResponse {
    items: [SellingOption!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }
`;
