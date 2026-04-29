import { gql } from "@apollo/client";

export const CREATE_BUYING_PRODUCT = gql`
  mutation CreateBuyingProduct(
    $input: CreateBuyingProductInput!
    $productImages: [Upload!]
    $productDefaultImageIndex: Int!
    $variantImages: [VariantImageInput!]
  ) {
    createBuyingProduct(
      input: $input
      productImages: $productImages
      productDefaultImageIndex: $productDefaultImageIndex
      variantImages: $variantImages
    ) {
      id
      productName
      slug
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
        warrantyType
        images {
          id
          xs
          isDefault
        }
      }
      createdAt
    }
  }
`;

export const UPDATE_BUYING_PRODUCT = gql`
  mutation UpdateBuyingProduct($id: ID!, $input: UpdateBuyingProductInput!) {
    updateBuyingProduct(id: $id, input: $input) {
      id
      productName
      productSubtitle
      slug
      isTrending
      brand {
        id
        name
      }
      category {
        id
        name
      }
      specifications {
        id
        key
        value
        group
        sortOrder
      }
      updatedAt
    }
  }
`;

export const DELETE_BUYING_PRODUCT = gql`
  mutation DeleteBuyingProduct($id: ID!) {
    deleteBuyingProduct(id: $id) {
      id
      message
    }
  }
`;

export const ADD_VARIANT_TO_PRODUCT = gql`
  mutation AddVariantToProduct(
    $productId: ID!
    $input: BuyingVariantInput!
    $images: [Upload!]!
    $defaultImageIndex: Int!
  ) {
    addVariantToProduct(
      productId: $productId
      input: $input
      images: $images
      defaultImageIndex: $defaultImageIndex
    ) {
      id
      sku
      shortId
      storage
      ram
      price
      mrp
    }
  }
`;

export const DELETE_VARIANT = gql`
  mutation DeleteVariant($variantId: ID!) {
    deleteVariant(variantId: $variantId) {
      id
      message
    }
  }
`;

export const ADD_VARIANT_IMAGES = gql`
  mutation AddVariantImages(
    $variantId: ID!
    $productId: ID!
    $images: [Upload!]!
    $defaultImageIndex: Int!
  ) {
    addVariantImages(
      variantId: $variantId
      productId: $productId
      images: $images
      defaultImageIndex: $defaultImageIndex
    ) {
      id
      variants {
        id
        images {
          id
          xs
          sm
          md
          lg
          alt
          isDefault
        }
      }
    }
  }
`;

export const DELETE_VARIANT_IMAGE = gql`
  mutation DeleteVariantImage($imageId: ID!) {
    deleteVariantImage(imageId: $imageId) {
      id
      message
    }
  }
`;
