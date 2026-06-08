import { gql } from "@apollo/client";

export const GET_BUYING_PRODUCTS = gql`
  query GetBuyingProducts($filter: BuyingProductFilterInput) {
    getBuyingProducts(filter: $filter) {
      items {
        id
        productName
        productSubtitle
        slug
        brandId
        manualBrand
        categoryId
        isTrending
        brand {
          id
          name
        }
        category {
          id
          name
        }
        variants {
          id
          sku

          storage
          ram
          price
          mrp
          quantity
          condition
          availability
          warrantyType
          color
          colorCode
          images {
            id
            xs
            sm
            md
            lg
            alt
            isDefault
            priority
          }
        }
        specifications {
          id
          key
          value
          group
          sortOrder
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
export const GET_BUYING_PRODUCT_BY_ID = gql`
  query GetBuyingProductById($id: ID!) {
    getBuyingProductById(id: $id) {
      id
      productName
      productSubtitle
      slug
      brandId
      manualBrand
      categoryId
      isTrending
      brand {
        id
        name
      }
      category {
        id
        name
      }
      variants {
        id
        sku
        liveLink
        variantSubtitle
        color
        colorCode
        storage
        ram
        price
        mrp
        emiBasePrice
        quantity
        reservedQuantity
        productSpec
        condition
        availability
        screenSize
        os
        processor
        batteryCapacity
        warrantyType
        warrantyDescription
        whatsInTheBox
        whatsExtra
        images {
          id
          xs
          sm
          md
          lg
          alt
          isDefault
          priority
        }
      }
      specifications {
        id
        key
        value
        group
        sortOrder
      }
      createdAt
      updatedAt
    }
  }
`;
