export const userTypeDefs = `#graphql
  type User {
    id: ID!
    fName: String!
    lName: String!
    pinCode: String!
    contact: String!
    password: String
    email: String
    userType: UserType
    status: UserStatus
    emailVerified: Boolean
    contactVerified: Boolean
    dailyOtpAttempts: Int
    lastOtpDate: DateTime
    isOtpBlocked: Boolean
    dailyResendOtpAttempts: Int
    lastResendDate: DateTime
    isResendBlocked: Boolean
    dailyVerificationOtpAttempts: Int
    lastVerificationDate: DateTime
    isVerificationBlocked: Boolean
    createdAt: DateTime
    updatedAt: DateTime
    sessions: [Session]
  }

  input CreateUserInput {
    fName: String!
    lName: String!
    pinCode: String!
    contact: String!
    email: String
    password: String
  }

  type LogoutResponse {
    message: String!
  }
`;
