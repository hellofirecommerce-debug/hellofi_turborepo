export const typeDefs = `#graphql
    type AuthResponse {
      success: Boolean!
      message: String!
      sessionId: String
      user: User
  }
    input AdminLoginInput {
     email: String!
     password: String!
     deviceInfo: DeviceInfoInput
  }
  
  input CreateAdminInput {
    fName: String!
    lName: String!
    email: String!
    password: String!
    contact: String!
    pincode: String!
    userType: UserType!
  }

    input DeviceInfoInput {
     deviceId: String
     deviceInfo: String
     ipAddress: String
  }
`;
