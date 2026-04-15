import { gql } from "@apollo/client";

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      invoiceNumber
      status
      pdfUrl
      createdAt
    }
  }
`;

export const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($input: UpdateInvoiceInput!) {
    updateInvoice(input: $input) {
      id
      invoiceNumber
      status
      pdfUrl
      updatedAt
    }
  }
`;

export const FINALIZE_INVOICE = gql`
  mutation FinalizeInvoice($id: ID!) {
    finalizeInvoice(id: $id) {
      id
      invoiceNumber
      status
      pdfUrl
    }
  }
`;

export const CANCEL_INVOICE = gql`
  mutation CancelInvoice($id: ID!) {
    cancelInvoice(id: $id) {
      id
      invoiceNumber
      status
    }
  }
`;
