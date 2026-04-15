export const mutations = `#graphql
  createInvoiceSettings(input: CreateInvoiceSettingsInput!): InvoiceCompanySettings!
  updateInvoiceSettings(input: UpdateInvoiceSettingsInput!): InvoiceCompanySettings!
  deleteInvoiceSettings(id: ID!): DeleteResponse!
  setDefaultInvoiceSettings(id: ID!): InvoiceCompanySettings!
`;
