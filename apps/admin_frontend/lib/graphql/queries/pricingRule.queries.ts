import { gql } from "@apollo/client";

export const GET_CONDITION_RULES = gql`
  query GetConditionRules($filter: ConditionRuleFilterInput) {
    getConditionRules(filter: $filter) {
      items {
        id
        ruleName
        description
        ruleLogic
        ruleBrandStrategy
        highestScoreType
        highestAction
        condition {
          id
          title
        }
        targetCondition {
          id
          title
        }
        targetOption {
          id
          label
        }
        triggers {
          id
          logic
          condition {
            id
            title
          }
          option {
            id
            label
          }
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_CONDITION_RULE_BY_ID = gql`
  query GetConditionRuleById($id: ID!) {
    getConditionRuleById(id: $id) {
      id
      conditionId
      ruleName
      description
      ruleLogic
      ruleBrandStrategy
      targetConditionId
      highestScoreType
      highestAction
      targetOptionId
      triggers {
        id
        conditionId
        optionId
        logic
      }
    }
  }
`;
