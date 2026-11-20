import { gql } from "@apollo/client";

export const GET_OPTIONS = gql`
  query GetOptions($filter: OptionFilterInput) {
    getOptions(filter: $filter) {
      items {
        id
        label
        action
        score
        scoreType
        priority
        isRedirect
        redirectTo
        brandVisibilityStrategy
        condition {
          id
          title
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
        }
        popupConditions {
          id
          title
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_OPTION_BY_ID = gql`
  query GetOptionById($id: ID!) {
    getOptionById(id: $id) {
      id
      conditionId
      label
      action
      score
      image
      scoreType
      isRedirect
      redirectTo
      priority
      title
      description
      brandVisibilityStrategy
      brandVisibility {
        id
        brandId
        brandName
        strategy
      }
      condition {
        id
        title
        step {
          id
          stepName
          assessment {
            id
            name
          }
        }
      }
      popupConditions {
        id
        title
      }
    }
  }
`;
