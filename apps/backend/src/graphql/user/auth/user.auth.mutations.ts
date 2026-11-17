export const mutations = `#graphql
    sendUserOTP(contact: String!): UserAuthResponse!
    registerAndSendUserOTP(
      firstName: String!
      lastName: String!
      contact: String!
      pinCode: String!
    ): UserAuthResponse!
    resendUserOTP(contact: String!): UserAuthResponse!
    verifyUserOTP(input: VerifyOTPInput!): UserAuthResponse!
    userLogout: UserAuthResponse!
`;
