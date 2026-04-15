export const queries = `#graphql
  getInvoices(filter: InvoiceFilterInput): InvoicesResponse!
  getInvoiceById(id: ID!): Invoice!
  getInvoiceByNumber(invoiceNumber: String!): Invoice!
  getNextInvoiceNumber: String!
`;
