import { gql } from "@apollo/client";

export const GET_CONDITIONS = gql`
  query GetConditions($filter: ConditionFilterInput) {
    getConditions(filter: $filter) {
      items {
        id
        title
        icon
        isRequired
        subtitle
        conditionType
        priority
        brandVisibilityStrategy
        step {
          id
          stepName
          assessment {
            id
            name
            category {
              id
              name
            }
          }
        }
        options {
          id
          label
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_CONDITION_BY_ID = gql`
  query GetConditionById($id: ID!) {
    getConditionById(id: $id) {
      id
      stepId
      parentOptionId
      conditionType
      title
      subtitle
      description
      finalConditionName
      image
      priority
      applicableFromDate
      brandVisibilityStrategy
      brandVisibility {
        id
        brandId
        brandName
        strategy
      }
      step {
        id
        stepName
        assessment {
          id
          name
          categoryId
        }
      }
      parentOption {
        id
        label
      }
      options {
        id
        label
        action
        score
        scoreType
        popupConditions {
          id
          title
        }
      }
    }
  }
`;
