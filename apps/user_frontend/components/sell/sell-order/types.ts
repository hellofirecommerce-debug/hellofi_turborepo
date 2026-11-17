export interface OfferOrder {
  orderNo: string;
  orderStatus: string;
  productName: string;
  productImage?: string | null;
  brandName?: string | null;
  variantName?: string | null;
  totalAmount?: number | null;
}
