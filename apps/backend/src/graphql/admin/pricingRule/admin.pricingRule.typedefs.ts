export const typeDefs = `#graphql
  enum RuleLogic {
    SKIP_ALL_OPTIONS
    APPLY_ONLY_SPECIFIC_OPTIONS
    SKIP_SELF
    APPLY_HIGHEST_PERCENTAGE
  }

  type ConditionRule {
    id: ID!
    conditionId: String!
    ruleName: String
    description: String
    ruleLogic: RuleLogic!
    ruleBrandStrategy: BrandVisibilityStrategy!
    targetConditionId: String
    highestScoreType: ScoreType!
    highestAction: OptionAction!
    targetOptionId: String
    condition: SellingCondition
    targetCondition: SellingCondition
    targetOption: SellingOption
    triggers: [ConditionRuleTrigger!]!
    ruleBrands: [ConditionRuleBrand!]!
    createdAt: String!
    updatedAt: String!
  }

  type ConditionRuleTrigger {
    id: ID!
    ruleId: String!
    conditionId: String!
    optionId: String!
    logic: String!
    condition: SellingCondition
    option: SellingOption
  }

  type ConditionRuleBrand {
    id: ID!
    ruleId: String!
    brandId: String
    brandName: String
  }

  input CreateConditionRuleInput {
    conditionId: String!
    ruleName: String
    description: String
    ruleLogic: RuleLogic!
    ruleBrandStrategy: BrandVisibilityStrategy
    targetConditionId: String
    highestScoreType: ScoreType
    highestAction: OptionAction
    targetOptionId: String
    triggers: [ConditionRuleTriggerInput!]
  }

  input UpdateConditionRuleInput {
    id: ID!
    ruleName: String
    description: String
    ruleLogic: RuleLogic
    ruleBrandStrategy: BrandVisibilityStrategy
    targetConditionId: String
    highestScoreType: ScoreType
    highestAction: OptionAction
    targetOptionId: String
    triggers: [ConditionRuleTriggerInput!]
  }

  input ConditionRuleTriggerInput {
    conditionId: String!
    optionId: String!
    logic: String
  }

  input ConditionRuleFilterInput {
    conditionId: String
    page: Int
    pageSize: Int
  }

  type ConditionRuleListResponse {
    items: [ConditionRule!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  input CreateBrandScoreInput {
    optionId: String!
    brandId: String!
    brandName: String
    score: Int!
    scoreType: ScoreType!
    action: OptionAction!
  }

  input CreateSeriesScoreInput {
    optionId: String!
    seriesId: String!
    seriesName: String
    score: Int!
    scoreType: ScoreType!
    action: OptionAction!
  }

  input CreateProductScoreInput {
    optionId: String!
    productId: String!
    productName: String
    score: Int!
    scoreType: ScoreType!
    action: OptionAction!
  }
`;
