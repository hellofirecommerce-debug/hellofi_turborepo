import { gql } from "@apollo/client";

export const ADMIN_UPDATE_ORDER_TIMELINE_STATUS = gql`
  mutation AdminUpdateOrderTimelineStatus(
    $orderNo: String!
    $status: String!
    $message: String
  ) {
    adminUpdateOrderTimelineStatus(
      orderNo: $orderNo
      status: $status
      message: $message
    ) {
      orderNo
      currentStatus
    }
  }
`;
