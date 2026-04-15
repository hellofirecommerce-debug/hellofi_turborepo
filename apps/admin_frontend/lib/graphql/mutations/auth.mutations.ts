import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($payload: AdminLoginInput!) {
    adminUserLogin(payload: $payload) {
      success
      message
      sessionId
      user {
        id
        fName
        lName
        email
        userType
        status
      }
    }
  }
`;

export const ADMIN_LOGOUT = gql`
  mutation AdminLogout {
    adminLogout {
      message
    }
  }
`;
