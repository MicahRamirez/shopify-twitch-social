import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { SkeletonBodyText } from "@shopify/polaris";
import { ShopifyProduct } from "./mocks/mockProducts";
import gql from "graphql-tag";

const GET_PRODUCTS_QUERY = gql`
  query getProducts($test: Int!) {
    products(first: $test) {
      edges {
        node {
          privateMetafields(first: 10) {
            edges {
              node {
                id
                namespace
                value
                valueType
              }
            }
          }
          title
          handle
          description
          featuredImage {
            id
          }
          id
          createdAt
        }
      }
    }
  }
`;

export interface Edge {
  node: ShopifyProduct;
  __typename: string;
}

export interface ShopifyProductGraph {
  products: { edges: Edge[] };
}

const translateGraphToArray = (
  shopifyProductGraph: ShopifyProductGraph
): ShopifyProduct[] => {
  return shopifyProductGraph.products
    ? shopifyProductGraph.products.edges.map(edge => {
        return {
          ...edge.node
        };
      })
    : [];
};

export const GetProducts = (props: any) => {
  console.log(props);
  const { loading, error, data } = useQuery<ShopifyProductGraph>(
    GET_PRODUCTS_QUERY,
    { variables: { test: 10 } }
  );
  return (
    <div>
      {error && <p>THERE WAS AN ERROR</p>}
      {loading && <SkeletonBodyText />}
      {!error && data && props.children(translateGraphToArray(data))}
    </div>
  );
};
