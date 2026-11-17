export const typeDefs = `#graphql
  enum AdminDateFilter {
    ALL_TIME
    THIS_MONTH
    LAST_MONTH
    LAST_3_MONTHS
    YEAR
    MONTH_YEAR
    DAY
    CUSTOM
  }

  enum FulfilmentFilter {
    ALL
    PENDING
    FULFILLED
  }

  enum TimelineStepState {
    DONE
    CURRENT
    NEXT
    LOCKED
  }

  input AdminOrderFilterInput {
    page: Int
    limit: Int
    dateFilter: AdminDateFilter
    startDate: String
    endDate: String
    year: Int
    month: Int
    productName: String
    customerName: String
    customerNumber: String
    orderNo: String
    city: String
    orderStatus: String
    timelineStatus: String
    fulfilment: FulfilmentFilter
  }

  type AdminOrderUser {
    id: ID!
    name: String
    phone: String
    pincode: String
  }

  type DeviceReportItem {
    conditionId: ID!
    question: String!
    answer: String!
  }

  type DeviceReportSection {
    stepId: ID!
    title: String!
    items: [DeviceReportItem!]!
  }

  type AdminSellingOrder {
    id: ID!
    orderNo: String!
    productName: String!
    productImage: String
    brandName: String!
    categoryName: String!
    variantName: String
    listedPrice: Float!
    quotedPriceBySystem: Float!
    quotedPrice: Float
    pickupCharges: Float!
    processingFee: Float!
    totalAmount: Float!
    orderStatus: String!
    pickupMethod: String
    isDropToOffice: Boolean!
    isFullFilled: Boolean!
    followupStatus: String
    followupCount: Int!
    serialOrIMEI: String
    additionalNotes: String
    invoiceLink: String
    createdAt: String!
    address: OrderAddress
    user: AdminOrderUser
    timelineName: String
    timelineStatus: String
    timelineLabel: String
    timelineUpdatedAt: String
    deviceReport: [DeviceReportSection!]!
  }

  type AdminOrdersPage {
    orders: [AdminSellingOrder!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type AdminTimelineStep {
    status: String!
    label: String!
    position: Int!
    state: TimelineStepState!
  }

  type AdminTimelineEvent {
    status: String!
    label: String!
    message: String
    createdAt: String!
  }

  type AdminOrderTimeline {
    orderNo: String!
    timelineName: String
    currentStatus: String
    steps: [AdminTimelineStep!]!
    events: [AdminTimelineEvent!]!
  }
`;
