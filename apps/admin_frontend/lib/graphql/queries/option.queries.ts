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
        # 👇 CHANGE TO PLURAL
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
      condition {
        id
        title
      }
      # 👇 CHANGE TO PLURAL
      popupConditions {
        id
        title
      }
    }
  }
`;
