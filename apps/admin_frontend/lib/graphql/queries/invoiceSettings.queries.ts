import { gql } from "@apollo/client";

export const GET_ALL_INVOICE_SETTINGS = gql`
  query GetInvoiceSettings {
    getInvoiceSettings {
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

export const GET_INVOICE_SETTINGS_BY_ID = gql`
  query GetInvoiceSettingsById($id: ID!) {
    getInvoiceSettingsById(id: $id) {
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

export const GET_DEFAULT_INVOICE_SETTINGS = gql`
  query GetDefaultInvoiceSettings {
    getDefaultInvoiceSettings {
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
