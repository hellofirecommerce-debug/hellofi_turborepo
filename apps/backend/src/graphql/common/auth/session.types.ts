export const sessionTypeDefs = `#graphql
  type Session {
    id: ID!
    sessionToken: String!
    userId: ID!
    expires: DateTime
    sessionTokenExpires: DateTime
    deviceId: String
    deviceInfo: String
    ipAddress: String
    lastActivityAt: DateTime
    createdAt: DateTime
    user: User
  }
`;
