export const queries = `#graphql
  adminSellingOrders(filter: AdminOrderFilterInput): AdminOrdersPage!
  adminOrderTimeline(orderNo: String!): AdminOrderTimeline!
  adminOrderCities: [String!]!
`;
