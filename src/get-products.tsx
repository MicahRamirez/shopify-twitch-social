import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { ShopifyProduct } from "./mocks/mockProducts";
import gql from "graphql-tag";

const GET_PRODUCTS_QUERY = gql`
  query getProducts($test: Number!) {
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

export const GetProducts = (props: any) => {
  console.log(props);
  const { loading, error, data } = useQuery<ShopifyProduct>(
    GET_PRODUCTS_QUERY,
    { variables: { test: 10 } }
  );
  return (
    <div>
      {error && <p>THERE WAS AN ERROR</p>}
      {loading && <p>LOADING RN</p>}
      {JSON.stringify(data)}
    </div>
  );
};
