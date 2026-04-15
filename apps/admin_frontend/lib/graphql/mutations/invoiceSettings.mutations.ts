import { gql } from "@apollo/client";

export const CREATE_INVOICE_SETTINGS = gql`
  mutation CreateInvoiceSettings($input: CreateInvoiceSettingsInput!) {
    createInvoiceSettings(input: $input) {
      id
      label
      isDefault
      isActive
      name
      address
      contact
      email
      gstin
      logoUrl
      stampUrl
      defaultInvoiceTermsBrand
      defaultInvoiceTermsHellofi
      defaultInvoiceTermsNone
      defaultBankDetails
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INVOICE_SETTINGS = gql`
  mutation UpdateInvoiceSettings($input: UpdateInvoiceSettingsInput!) {
    updateInvoiceSettings(input: $input) {
      id
      label
      isDefault
      isActive
      name
      address
      contact
      email
      gstin
      logoUrl
      stampUrl
      defaultInvoiceTermsBrand
      defaultInvoiceTermsHellofi
      defaultInvoiceTermsNone
      defaultBankDetails
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_INVOICE_SETTINGS = gql`
  mutation DeleteInvoiceSettings($id: ID!) {
    deleteInvoiceSettings(id: $id) {
      message
      id
    }
  }
`;

export const SET_DEFAULT_INVOICE_SETTINGS = gql`
  mutation SetDefaultInvoiceSettings($id: ID!) {
    setDefaultInvoiceSettings(id: $id) {
      id
      label
      isDefault
    }
  }
`;
