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

export const GET_AVAILABLE_FILTERS = gql`
  query GetAvailableFilters($categorySlugs: [String!]) {
    getAvailableFilters(categorySlugs: $categorySlugs) {
      categories {
        id
        name
        seoName
      }
      storages
      rams
      conditions
      osList
      screenSizes
      processors
      batteryCapacities
      warrantyTypes
      brands {
        id
        name
      }
      priceRange {
        min
        max
      }
    }
  }
`;

export const GET_FILTERED_BUYING_PRODUCTS = gql`
  query GetFilteredBuyingProducts($filter: BuyingProductFilterInput) {
    getFilteredBuyingProducts(filter: $filter) {
      items {
        id
        productName
        productSubtitle
        slug
        brand { id name }
        manualBrand
        storage
        condition
        warrantyType
        price
        mrp
        emiBasePrice
        image { md lg alt }
      }
      nextCursor
      hasMore
    }
  }
`;