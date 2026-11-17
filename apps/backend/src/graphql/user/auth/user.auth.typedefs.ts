export const typeDefs = `#graphql
  type UserAuthResponse {
    success: Boolean!
    message: String!
    sessionId: String
    accessToken: String
    needsRegistration: Boolean
    user: User
  }

  type UserCheckStatusResponse {
    exists: Boolean!
    needsRegistration: Boolean!
    incompleteProfile: Boolean
    message: String!
    user: User
  }

  input CheckUserStatusInput { contact: String! }
  input SendOTPInput { contact: String! }
  input ResendOTPInput { contact: String! }
  input CompleteRegistrationInput {
    firstName: String!
    lastName: String!
    contact: String!
    pinCode: String!
  }
  input VerifyOTPInput {
    contact: String!
    otp: String!
  }
`;
