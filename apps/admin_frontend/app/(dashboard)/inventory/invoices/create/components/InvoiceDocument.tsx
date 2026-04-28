import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
  Font,
} from "@react-pdf/renderer";
import { InvoiceData } from "../page";
import { InvoiceCompanySettings } from "../../../settings/types";
import { formatPaymentMode } from "../../../../../../lib/utils/formatPaymentMode";

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9V1s.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf",
      fontWeight: 700,
    },
  ],
});

const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB");
};

const S = StyleSheet.create({
  page: {
    padding: 14,
    fontSize: 8,
    fontFamily: "Poppins",
    color: "#000",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 6,
  },
  outer: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    flexDirection: "column",
    flex: 1,
    width: "100%",
  },
  headerRow: { flexDirection: "row", borderBottom: "1px solid black" },
  headerLeft: { width: "50%", borderRight: "1px solid black" },
  headerRight: { width: "50%" },
  logoBox: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  detailBox: { borderTop: "1px solid black", padding: 5 },
  billingBox: { padding: 5 },
  invoiceInfoBox: {
    height: 61,
    padding: 6,
    justifyContent: "center",
    borderBottom: "1px solid black",
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Poppins",
    fontWeight: 700,
    textDecoration: "underline",
    marginBottom: 3,
  },
  line: { fontSize: 7.5, marginBottom: 1.5 },
  bold: { fontFamily: "Poppins", fontWeight: 700 },
  infoRow: { flexDirection: "row", marginBottom: 2 },
  infoLabel: {
    fontFamily: "Poppins",
    fontWeight: 700,
    fontSize: 9,
    marginRight: 2,
  },
  infoValue: { fontSize: 9, fontFamily: "Poppins", fontWeight: 700 },
  table: {},
  tableHeaderWrapper: {
    flexDirection: "column",
    borderBottom: "1px solid black",
    backgroundColor: "#f3f4f6",
  },
  thRow1: { flexDirection: "row", borderBottom: "1px solid black" },
  thRow2: { flexDirection: "row" },
  th: {
    fontSize: 6.5,
    fontFamily: "Poppins",
    fontWeight: 700,
    textAlign: "center",
    padding: "2.5 2",
    borderRight: "1px solid black",
  },
  thLast: {
    fontSize: 6.5,
    fontFamily: "Poppins",
    fontWeight: 700,
    textAlign: "center",
    padding: "2.5 2",
  },
  tr: { flexDirection: "row", borderBottom: "1px solid black" },
  td: {
    fontSize: 7,
    textAlign: "center",
    padding: "2.5 2",
    borderRight: "1px solid black",
  },
  tdLeft: {
    fontSize: 7,
    textAlign: "left",
    padding: "2.5 3",
    borderRight: "1px solid black",
  },
  tdLast: { fontSize: 7, textAlign: "center", padding: "2.5 2" },
  tdB: { fontFamily: "Poppins", fontWeight: 700 },
  cSno: { width: "3%" },
  cProduct: { width: "26%" },
  cHsn: { width: "6%" },
  cQty: { width: "3.5%" },
  cUom: { width: "4%" },
  cRate: { width: "9%" },
  cTotal: { width: "9%" },
  cDiscount: { width: "8%" },
  cGross: { width: "8%" },
  cGstGroup: { width: "12%" },
  cGstCol: { width: "6%" },
  cIgstGroup: { width: "24%" },
  cIgstRate: { width: "12%" },
  cIgstAmt: { width: "12%" },
  footerSection: { flexDirection: "row", flex: 1 },
  footerLeft: {
    width: "50%",
    borderRight: "1px solid black",
    padding: 5,
    flexDirection: "column",
    gap: 5,
  },
  footerRight: {
    width: "50%",
    padding: 5,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  footerTitle: {
    fontSize: 8,
    fontFamily: "Poppins",
    fontWeight: 700,
    textDecoration: "underline",
    marginBottom: 5,
  },
  footerLine: { fontSize: 7, marginBottom: 1.5, lineHeight: 1.3 },
  sumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  sumLabel: { fontSize: 8, fontFamily: "Poppins", fontWeight: 700 },
  sumValue: { fontSize: 8 },
  sumDivider: { borderTop: "1px solid black", paddingTop: 2, marginBottom: 2 },
  signBox: { alignItems: "center", marginTop: 4 },
  stamp: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    marginBottom: 3,
  },
  sigTxt: {
    fontSize: 8,
    fontFamily: "Poppins",
    fontWeight: 700,
    borderTop: "2px solid black",
    paddingTop: 3,
  },
  footer: {
    fontSize: 6.5,
    fontFamily: "Poppins",
    textAlign: "center",
    color: "#6b7280",
    marginTop: 5,
  },
  tcLink: { fontSize: 7, color: "#2563eb", textDecoration: "underline" },
});

const gstTd = {
  fontSize: 7,
  textAlign: "center" as const,
  padding: "2.5 2",
  borderRight: "1px solid black",
  width: "6%",
};

const gstTdLast = {
  fontSize: 7,
  textAlign: "center" as const,
  padding: "2.5 2",
  width: "6%",
};

interface InvoiceDocumentProps {
  data: InvoiceData;
  selectedSettings?: InvoiceCompanySettings;
}

export function InvoiceDocument({
  data,
  selectedSettings,
}: InvoiceDocumentProps) {
  // ── Guard against null/undefined data during loading ──
  if (!data || !data.billingAddress || !data.invoiceDetails || !data.items) {
    return (
      <Document>
        <Page size="A4" orientation="landscape">
          <Text> </Text>
        </Page>
      </Document>
    );
  }

  const billingAddress = data.billingAddress;
  const invoiceDetails = data.invoiceDetails;
  const items = data.items;
  const exchangeItems = data.exchangeItems ?? [];
  const saleType = data.saleType;
  const additionalInfo = data.additionalInfo;

  const inBLR = billingAddress.isInsideBangalore ?? true;
  const totalRate = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const totalTotal = items.reduce((s, i) => s + i.total, 0);
  const totalDiscount = items.reduce((s, i) => s + i.discount, 0);

  const invoiceTermsLines = (
    additionalInfo?.invoiceTerms ||
    selectedSettings?.defaultInvoiceTermsBrand ||
    ""
  )
    .split("\n")
    .filter(Boolean);

  const bankDetailsLines = (
    additionalInfo?.bankDetails ||
    selectedSettings?.defaultBankDetails ||
    ""
  )
    .split("\n")
    .filter(Boolean);

  const fixedThCells = (
    <>
      <Text style={[S.th, S.cSno]}> </Text>
      <Text style={[S.th, S.cProduct]}> </Text>
      <Text style={[S.th, S.cHsn]}> </Text>
      <Text style={[S.th, S.cQty]}> </Text>
      <Text style={[S.th, S.cUom]}> </Text>
      <Text style={[S.th, S.cRate]}> </Text>
      <Text style={[S.th, S.cTotal]}> </Text>
      <Text style={[S.th, S.cDiscount]}> </Text>
      <Text style={[S.th, S.cGross]}> </Text>
    </>
  );

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={S.page}>
        <Text style={S.title}>Tax Invoice</Text>

        <View style={S.outer}>
          {/* ── HEADER ── */}
          <View style={S.headerRow}>
            <View style={S.headerLeft}>
              <View style={S.logoBox}>
                {selectedSettings?.logoUrl ? (
                  <Image
                    src={selectedSettings.logoUrl}
                    style={{ width: 60, height: 60 }}
                  />
                ) : null}
              </View>
              <View style={S.detailBox}>
                <Text style={S.sectionTitle}>Company Details</Text>
                <Text style={S.line}>
                  <Text style={S.bold}>{selectedSettings?.name ?? "—"}</Text>
                </Text>
                <Text style={S.line}>
                  <Text style={S.bold}>Address: </Text>
                  {selectedSettings?.address ?? "—"}
                </Text>
                <Text style={S.line}>
                  <Text style={S.bold}>Contact: </Text>
                  {selectedSettings?.contact ?? "—"}
                </Text>
                <Text style={S.line}>
                  <Text style={S.bold}>Email id: </Text>
                  {selectedSettings?.email ?? "—"}
                </Text>
                <Text style={S.line}>
                  <Text style={S.bold}>GSTIN: </Text>
                  {selectedSettings?.gstin ?? "—"}
                </Text>
              </View>
            </View>

            <View style={S.headerRight}>
              <View style={S.invoiceInfoBox}>
                <View style={S.infoRow}>
                  <Text style={S.infoLabel}>Invoice N.</Text>
                  <Text style={S.infoValue}>
                    {invoiceDetails.invoiceNumber}
                  </Text>
                </View>
                <View style={S.infoRow}>
                  <Text style={S.infoLabel}>Invoice Date:</Text>
                  <Text style={S.infoValue}>
                    {formatDate(invoiceDetails.invoiceDate)}
                  </Text>
                </View>
              </View>
              <View style={S.billingBox}>
                <Text style={S.sectionTitle}>Billing Address</Text>
                <Text style={S.line}>
                  <Text style={S.bold}>Name: </Text>
                  {billingAddress.name || "—"}
                </Text>
                <Text style={S.line}>
                  <Text style={S.bold}>Address: </Text>
                  {billingAddress.address || "—"}
                </Text>
                <Text style={S.line}>
                  <Text style={S.bold}>Email id: </Text>
                  {billingAddress.email || "—"}
                </Text>
                <Text style={S.line}>
                  <Text style={S.bold}>Contact Number: </Text>
                  {billingAddress.contactNumber || "—"}
                </Text>
                {billingAddress.gstNumber ? (
                  <Text style={S.line}>
                    <Text style={S.bold}>GSTIN: </Text>
                    {billingAddress.gstNumber}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* ── TABLE ── */}
          <View style={S.table}>
            <View style={S.tableHeaderWrapper}>
              <View style={S.thRow1}>
                <Text style={[S.th, S.cSno]}>S.NO</Text>
                <Text style={[S.th, S.cProduct]}>PRODUCT</Text>
                <Text style={[S.th, S.cHsn]}>HSN/SAC</Text>
                <Text style={[S.th, S.cQty]}>QTY</Text>
                <Text style={[S.th, S.cUom]}>UOM</Text>
                <Text style={[S.th, S.cRate]}>RATE</Text>
                <Text style={[S.th, S.cTotal]}>TOTAL</Text>
                <Text style={[S.th, S.cDiscount]}>DISCOUNT</Text>
                <Text style={[S.th, S.cGross]}>GROSS</Text>
                {inBLR ? (
                  <>
                    <Text style={[S.th, S.cGstGroup]}>CGST</Text>
                    <Text style={[S.thLast, S.cGstGroup]}>SGST</Text>
                  </>
                ) : (
                  <Text style={[S.thLast, S.cIgstGroup]}>IGST</Text>
                )}
              </View>
              <View style={S.thRow2}>
                {fixedThCells}
                {inBLR ? (
                  <>
                    <Text style={[S.th, S.cGstCol]}>Rate</Text>
                    <Text style={[S.th, S.cGstCol]}>Amount</Text>
                    <Text style={[S.th, S.cGstCol]}>Rate</Text>
                    <Text style={[S.thLast, S.cGstCol]}>Amount</Text>
                  </>
                ) : (
                  <>
                    <Text style={[S.th, S.cIgstRate]}>Rate</Text>
                    <Text style={[S.thLast, S.cIgstAmt]}>Amount</Text>
                  </>
                )}
              </View>
            </View>

            {items.map((item, index) => {
              const cgst = inBLR ? item.gstAmount / 2 : 0;
              const sgst = inBLR ? item.gstAmount / 2 : 0;
              const igst = !inBLR ? item.gstAmount : 0;
              const isLast = index === items.length - 1;
              const hasExchange =
                saleType === "exchange" && exchangeItems.length > 0;

              return (
                <View key={item.id}>
                  <View style={S.tr}>
                    <Text style={[S.td, S.cSno]}>{index + 1}</Text>
                    <View
                      style={[
                        S.cProduct,
                        { borderRight: "1px solid black", padding: "2.5 3" },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 7,
                          fontFamily: "Poppins",
                          fontWeight: 700,
                        }}
                      >
                        {item.product || "—"}
                      </Text>
                      <Text style={{ fontSize: 6.5 }}>
                        S/N:{" "}
                        <Text
                          style={{ fontFamily: "Poppins", fontWeight: 700 }}
                        >
                          {item.serialNumber || "—"}
                        </Text>
                      </Text>
                    </View>
                    <Text style={[S.td, S.cHsn]}>
                      {item.hsnSac ? item.hsnSac.substring(0, 4) : "—"}
                    </Text>
                    <Text style={[S.td, S.cQty]}>{item.qty}</Text>
                    <Text style={[S.td, S.cUom]}>{item.uom}</Text>
                    <Text style={[S.td, S.cRate]}>
                      {formatCurrency(item.rate)}
                    </Text>
                    <Text style={[S.td, S.cTotal]}>
                      {formatCurrency(item.total)}
                    </Text>
                    <Text style={[S.td, S.cDiscount]}>
                      {formatCurrency(item.discount)}
                    </Text>
                    <Text style={[S.td, S.cGross]}>
                      {formatCurrency(item.gross)}
                    </Text>
                    {inBLR ? (
                      <>
                        <Text style={gstTd}>9%</Text>
                        <Text style={gstTd}>{formatCurrency(cgst)}</Text>
                        <Text style={gstTd}>9%</Text>
                        <Text style={gstTdLast}>{formatCurrency(sgst)}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={[S.td, S.cIgstRate]}>18%</Text>
                        <Text style={[S.tdLast, S.cIgstAmt]}>
                          {formatCurrency(igst)}
                        </Text>
                      </>
                    )}
                  </View>

                  {isLast &&
                    hasExchange &&
                    exchangeItems.map((ex, ei) => (
                      <View
                        key={`ex-${ei}`}
                        style={{
                          flexDirection: "row",
                          borderBottom: "1px solid black",
                          backgroundColor: "#fff7ed",
                        }}
                      >
                        <Text style={[S.td, S.cSno]}> </Text>
                        <View style={{ flex: 1, padding: "3 4" }}>
                          <Text style={{ fontSize: 7 }}>
                            Exchange with{" "}
                            <Text
                              style={{ fontFamily: "Poppins", fontWeight: 700 }}
                            >
                              {ex.productName}
                              {(ex as any).ram && (ex as any).storage
                                ? ` (${(ex as any).ram}/${(ex as any).storage})`
                                : ""}
                            </Text>
                          </Text>
                          {ex.serialNumber ? (
                            <Text style={{ fontSize: 6.5 }}>
                              S/N:{" "}
                              <Text
                                style={{
                                  fontFamily: "Poppins",
                                  fontWeight: 700,
                                }}
                              >
                                {ex.serialNumber}
                              </Text>
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    ))}
                </View>
              );
            })}

            <View style={[S.tr, { backgroundColor: "#f9fafb" }]}>
              <Text style={[S.td, S.cSno]}> </Text>
              <Text style={[S.tdLeft, S.cProduct, S.tdB]}>Total</Text>
              <Text style={[S.td, S.cHsn]}> </Text>
              <Text style={[S.td, S.cQty]}> </Text>
              <Text style={[S.td, S.cUom]}> </Text>
              <Text style={[S.td, S.cRate, S.tdB]}>
                {formatCurrency(totalRate)}
              </Text>
              <Text style={[S.td, S.cTotal, S.tdB]}>
                {formatCurrency(totalTotal)}
              </Text>
              <Text style={[S.td, S.cDiscount, S.tdB]}>
                {formatCurrency(totalDiscount)}
              </Text>
              <Text style={[S.td, S.cGross, S.tdB]}>
                {formatCurrency(data.grossValue)}
              </Text>
              {inBLR ? (
                <>
                  <Text style={gstTd}>-</Text>
                  <Text
                    style={{
                      ...gstTd,
                      fontFamily: "Poppins",
                      fontWeight: 700,
                    }}
                  >
                    {formatCurrency(data.gstCalculation.cgst)}
                  </Text>
                  <Text style={gstTd}>-</Text>
                  <Text
                    style={{
                      ...gstTdLast,
                      fontFamily: "Poppins",
                      fontWeight: 700,
                    }}
                  >
                    {formatCurrency(data.gstCalculation.sgst)}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[S.td, S.cIgstRate]}>-</Text>
                  <Text style={[S.tdLast, S.cIgstAmt, S.tdB]}>
                    {formatCurrency(data.gstCalculation.igst)}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* ── FOOTER ── */}
          <View style={S.footerSection}>
            <View style={S.footerLeft}>
              {invoiceTermsLines.length > 0 && (
                <View>
                  <Text style={S.footerTitle}>Invoice Terms:</Text>
                  {invoiceTermsLines.map((line, i) => (
                    <Text key={i} style={S.footerLine}>
                      {line}
                    </Text>
                  ))}
                </View>
              )}
              {bankDetailsLines.length > 0 && (
                <View>
                  <Text style={S.footerTitle}>Bank Details</Text>
                  {bankDetailsLines.map((line, i) => (
                    <Text key={i} style={S.footerLine}>
                      {line}
                    </Text>
                  ))}
                </View>
              )}
              <View>
                <Text style={S.footerLine}>T&C Applied</Text>
                <Link
                  src="https://hellofi.in/return-refund-policy"
                  style={S.tcLink}
                >
                  https://hellofi.in/return-refund-policy
                </Link>
              </View>
            </View>

            <View style={S.footerRight}>
              <View>
                <View style={S.sumRow}>
                  <Text style={S.sumLabel}>Gross Value</Text>
                  <Text style={S.sumValue}>
                    {formatCurrency(data.grossValue)}
                  </Text>
                </View>
                <View style={S.sumRow}>
                  <Text style={S.sumLabel}>Tax</Text>
                  <Text style={S.sumValue}>
                    {formatCurrency(data.taxAmount)}
                  </Text>
                </View>
                <View style={[S.sumRow, S.sumDivider]}>
                  <Text style={S.sumLabel}>Total</Text>
                  <Text style={S.sumLabel}>
                    {formatCurrency(data.totalAmount)}
                  </Text>
                </View>
                {saleType === "exchange" && (
                  <>
                    <View style={S.sumRow}>
                      <Text style={[S.sumLabel, { color: "#d97706" }]}>
                        Exchange Value
                      </Text>
                      <Text
                        style={{
                          fontSize: 8,
                          color: "#d97706",
                          fontWeight: 700,
                        }}
                      >
                        - {formatCurrency(data.exchangeValue)}
                      </Text>
                    </View>
                    <View style={[S.sumRow, S.sumDivider]}>
                      <Text style={S.sumLabel}>Amount Paid</Text>
                      <Text style={S.sumLabel}>
                        {formatCurrency(data.amountPaid)}
                      </Text>
                    </View>
                  </>
                )}
                <View style={S.sumRow}>
                  <Text style={{ fontSize: 8 }}>
                    Paid by {formatPaymentMode(billingAddress.paidBy)}
                    {billingAddress.paidBy === "SPLIT_PAYMENT" &&
                    billingAddress.splitPaymentDetails
                      ? ` (${billingAddress.splitPaymentDetails})`
                      : ""}
                  </Text>
                </View>
              </View>
              <View style={S.signBox}>
                <View style={S.stamp}>
                  {selectedSettings?.stampUrl ? (
                    <Image
                      src={selectedSettings.stampUrl}
                      style={{ width: 50, height: 50 }}
                    />
                  ) : null}
                </View>
                <Text style={S.sigTxt}>Authorized Signature</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={S.footer}>
          This is a computer generated invoice and does not require physical
          signature for validity.{"\n"}
          For any queries, please contact us at the above mentioned details.
        </Text>
      </Page>
    </Document>
  );
}
