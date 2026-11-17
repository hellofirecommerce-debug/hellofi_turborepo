import { gql } from "@apollo/client";

export const CREATE_CONDITION_RULE = gql`
  mutation CreateConditionRule($input: CreateConditionRuleInput!) {
    createConditionRule(input: $input) {
      id
      ruleName
    }
  }
`;

export const UPDATE_CONDITION_RULE = gql`
  mutation UpdateConditionRule($input: UpdateConditionRuleInput!) {
    updateConditionRule(input: $input) {
      id
      ruleName
    }
  }
`;

export const DELETE_CONDITION_RULE = gql`
  mutation DeleteConditionRule($id: ID!) {
    deleteConditionRule(id: $id) {
      message
      id
    }
  }
`;

export const CREATE_BRAND_SCORE = gql`
  mutation CreateBrandScore($input: CreateBrandScoreInput!) {
    createBrandScore(input: $input) {
      id
    }
  }
`;

export const DELETE_BRAND_SCORE = gql`
  mutation DeleteBrandScore($id: ID!) {
    deleteBrandScore(id: $id) {
      message
      id
    }
  }
`;

export const CREATE_SERIES_SCORE = gql`
  mutation CreateSeriesScore($input: CreateSeriesScoreInput!) {
    createSeriesScore(input: $input) {
      id
    }
  }
`;

export const DELETE_SERIES_SCORE = gql`
  mutation DeleteSeriesScore($id: ID!) {
    deleteSeriesScore(id: $id) {
      message
      id
    }
  }
`;

export const CREATE_PRODUCT_SCORE = gql`
  mutation CreateProductScore($input: CreateProductScoreInput!) {
    createProductScore(input: $input) {
      id
    }
  }
`;

export const DELETE_PRODUCT_SCORE = gql`
  mutation DeleteProductScore($id: ID!) {
    deleteProductScore(id: $id) {
      message
      id
    }
  }
`;
