export const mutations = `#graphql
  createInvoice(input: CreateInvoiceInput!): Invoice!
  updateInvoice(input: UpdateInvoiceInput!): Invoice!
  finalizeInvoice(id: ID!): Invoice!
  cancelInvoice(id: ID!): Invoice!
`;
