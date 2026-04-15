import { gql } from "@apollo/client";

export const ADMIN_ME = gql`
  query AdminMe {
    adminMe {
      id
      fName
      lName
      email
      userType
      status
    }
  }
`;
