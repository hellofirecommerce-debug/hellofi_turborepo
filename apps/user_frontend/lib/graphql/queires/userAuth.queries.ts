import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetUserMe {
    getUserMe {
      id
      fName
      lName
      contact
      pinCode
    }
  }
`;
