import { gql } from "@apollo/client";

// Registered users only. Unregistered → needsRegistration: true, no SMS sent
export const SEND_USER_OTP = gql`
  mutation SendUserOTP($contact: String!) {
    sendUserOTP(contact: $contact) {
      success
      needsRegistration
      message
    }
  }
`;

// New users: register + send OTP in one call
export const REGISTER_AND_SEND_USER_OTP = gql`
  mutation RegisterAndSendUserOTP(
    $firstName: String!
    $lastName: String!
    $contact: String!
    $pinCode: String!
  ) {
    registerAndSendUserOTP(
      firstName: $firstName
      lastName: $lastName
      contact: $contact
      pinCode: $pinCode
    ) {
      success
      message
    }
  }
`;

export const RESEND_USER_OTP = gql`
  mutation ResendUserOTP($contact: String!) {
    resendUserOTP(contact: $contact) {
      success
      message
    }
  }
`;

export const VERIFY_USER_OTP = gql`
  mutation VerifyUserOTP($input: VerifyOTPInput!) {
    verifyUserOTP(input: $input) {
      success
      message
      accessToken
      user {
        id
        fName
        lName
        contact
      }
    }
  }
`;

export const CREATE_SELLING_ORDER = gql`
  mutation CreateSellingOrder($input: CreateSellingOrderInput!) {
    createSellingOrder(input: $input) {
      orderId
      orderNo
      orderLink
      status
      quote {
        finalQuote
        basePrice
        totalDeduction
        totalAddition
      }
    }
  }
`;
