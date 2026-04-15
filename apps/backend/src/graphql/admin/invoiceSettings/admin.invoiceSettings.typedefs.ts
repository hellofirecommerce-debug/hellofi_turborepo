export const typeDefs = `#graphql
  type InvoiceCompanySettings {
    id: ID!
    label: String!
    isDefault: Boolean!
    isActive: Boolean!

    # Company Details
    name: String!
    address: String!
    contact: String!
    email: String!
    gstin: String!
    logoUrl: String
    stampUrl: String

    # Default Terms
    defaultInvoiceTermsBrand: String!
    defaultInvoiceTermsHellofi: String!
    defaultInvoiceTermsNone: String!
    defaultBankDetails: String!

    createdAt: String!
    updatedAt: String!
  }

  input CreateInvoiceSettingsInput {
    label: String!
    isDefault: Boolean

    # Company Details
    name: String!
    address: String!
    contact: String!
    email: String!
    gstin: String!
    logoUrl: String
    stampUrl: String

    # Default Terms
    defaultInvoiceTermsBrand: String!
    defaultInvoiceTermsHellofi: String!
    defaultInvoiceTermsNone: String!
    defaultBankDetails: String!
  }

  input UpdateInvoiceSettingsInput {
    id: ID!
    label: String!
    isDefault: Boolean

    # Company Details
    name: String!
    address: String!
    contact: String!
    email: String!
    gstin: String!
    logoUrl: String
    stampUrl: String

    # Default Terms
    defaultInvoiceTermsBrand: String!
    defaultInvoiceTermsHellofi: String!
    defaultInvoiceTermsNone: String!
    defaultBankDetails: String!
  }
`;
