// lib/graphql/queries/buyingProduct.queries.ts
import { gql } from "@apollo/client";

export const GET_BUYING_PRODUCTS_BY_SECTION = gql`
  query GetBuyingProductsBySection(
    $section: BuyingProductSection!
    $categorySlug: String
  ) {
    getBuyingProductsBySection(section: $section, categorySlug: $categorySlug) {
      id
      productName
      brand {
        name
      }
      manualBrand
      storage
      condition
      warrantyType
      price
      mrp
      emiBasePrice
      image {
        md
        lg
        alt
      }
    }
  }
`;
