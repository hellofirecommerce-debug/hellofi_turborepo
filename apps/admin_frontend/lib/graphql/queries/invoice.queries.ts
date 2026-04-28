import { gql } from "@apollo/client";

export const GET_INVOICES = gql`
  query GetInvoices($filter: InvoiceFilterInput) {
    getInvoices(filter: $filter) {
      items {
        id
        invoiceNumber
        invoiceDate
        companySettingsId
        companySettings {
          id
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
        }
        clientName
        clientAddress
        clientEmail
        clientContact
        clientGstin
        isInsideBangalore
        paidBy
        saleType
        warrantyType
        warrantyMonths
        grossValue
        taxAmount
        totalAmount
        exchangeValue
        amountPaid
        cgst
        sgst
        igst
        customInvoiceTerms
        customBankDetails
        pdfUrl
        status
        items {
          id
          product
          serialNumber
          hsnSac
          qty
          uom
          rate
          total
          discount
          gross
          gstAmount
          cgstPercent
          cgstAmount
          sgstPercent
          sgstAmount
          igstPercent
          igstAmount
          sortOrder
        }
        exchangeItems {
          id
          productName
          serialNumber
          brandId
          categoryId
          ram
          storage
          exchangeValue
        }
        createdAt
        updatedAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_INVOICE_BY_ID = gql`
  query GetInvoiceById($id: ID!) {
    getInvoiceById(id: $id) {
      id
      invoiceNumber
      invoiceDate
      companySettingsId
      companySettings {
        id
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
      }
      clientName
      clientAddress
      clientEmail
      clientContact
      clientGstin
      isInsideBangalore
      paidBy
      splitPaymentDetails
      saleType
      warrantyType
      warrantyMonths
      grossValue
      taxAmount
      totalAmount
      exchangeValue
      amountPaid
      cgst
      sgst
      igst
      customInvoiceTerms
      customBankDetails
      status
      items {
        id
        inventoryProductId
        product
        serialNumber
        hsnSac
        qty
        uom
        rate
        total
        discount
        gross
        gstAmount
        cgstPercent
        cgstAmount
        sgstPercent
        sgstAmount
        igstPercent
        igstAmount
        sortOrder
      }
      exchangeItems {
        id
        productName
        serialNumber
        brandId
        categoryId
        ram
        storage
        exchangeValue
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INVOICE_BY_NUMBER = gql`
  query GetInvoiceByNumber($invoiceNumber: String!) {
    getInvoiceByNumber(invoiceNumber: $invoiceNumber) {
      id
      invoiceNumber
      status
      pdfUrl
    }
  }
`;

export const GET_NEXT_INVOICE_NUMBER = gql`
  query GetNextInvoiceNumber {
    getNextInvoiceNumber
  }
`;
