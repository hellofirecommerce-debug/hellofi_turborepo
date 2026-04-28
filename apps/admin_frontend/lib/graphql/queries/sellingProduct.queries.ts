import { gql } from "@apollo/client";

export const GET_SELLING_PRODUCTS = gql`
  query GetSellingProducts($filter: SellingProductFilterInput) {
    getSellingProducts(filter: $filter) {
      items {
        id
        productName
        productSeoName
        brandId
        categoryId
        seriesId
        image
        releasedYear
        launchedDate
        productPrice
        status
        hasVariants
        isConstantRam
        ram
        brand {
          id
          name
        }
        category {
          id
          name
        }
        series {
          id
          seriesName
        }
        variants {
          id
          ram
          storage
          productPrice
          status
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

export const GET_SELLING_PRODUCT_BY_ID = gql`
  query GetSellingProductById($id: ID!) {
    getSellingProductById(id: $id) {
      id
      productName
      productSeoName
      brandId
      categoryId
      seriesId
      image
      releasedYear
      launchedDate
      productPrice
      status
      hasVariants
      isConstantRam
      ram
      brand {
        id
        name
      }
      category {
        id
        name
      }
      series {
        id
        seriesName
      }
      variants {
        id
        ram
        storage
        productPrice
        status
      }
      createdAt
      updatedAt
    }
  }
`;
