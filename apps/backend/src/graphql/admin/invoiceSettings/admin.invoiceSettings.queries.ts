export const queries = `#graphql
  getInvoiceSettings: [InvoiceCompanySettings!]!
  getInvoiceSettingsById(id: ID!): InvoiceCompanySettings!
  getDefaultInvoiceSettings: InvoiceCompanySettings
`;
