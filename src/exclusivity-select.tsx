import React, { useState } from "react";
import { Select, Button } from "@shopify/polaris";
import {
  generateShopifyMockProducts,
  ShopifyProduct
} from "./mocks/mockProducts";
import { useEffect } from "react";

export interface ExclusivityRule {
  label: string;
  value: string;
}

export const CreateExclusivityRule: React.FC<{
  mergePendingRules: Function;
  pendingRules: ExclusivityRule[] | undefined;
}> = ({ mergePendingRules, pendingRules }) => {
  // generate mock items once
  useEffect(() => {
    const mockShopifyProducts = generateShopifyMockProducts(6);
    setGeneratedMock(mockShopifyProducts);
  }, []);
  // TODO: Remove mock generation?
  const [generatedMock, setGeneratedMock] = useState<ShopifyProduct[]>([]);
  const [selected, setSelectedProduct] = useState<ShopifyProduct>();
  const [selectValue, setSelectValue] = useState();
  // probably need to memo
  const options = generatedMock.map(({ id, title }) => ({
    value: id,
    label: title
  }));
  // map ids (select value) to product object
  const productMap = generatedMock.reduce<{ [key: string]: ShopifyProduct }>(
    (acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr
      };
    },
    {}
  );
  console.log(options);
  console.log("selected title", selected && selected.title);
  return (
    <div
      style={{
        display: "inline-block",
        marginBottom: "24px",
        marginTop: "24px"
      }}
    >
      <div
        style={{
          display: "inline-block",
          paddingRight: "12px",
          paddingLeft: "12px"
        }}
      >
        <Select
          options={options}
          label="Add a new exclusivity rule"
          placeholder="Select a product"
          value={selectValue}
          onChange={val => {
            const selectedProduct = productMap[val];
            // idx into the arr
            setSelectedProduct(selectedProduct);
            // the select requires the VALUE in the options, DUH
            setSelectValue(selectedProduct.id);
          }}
        />
      </div>
      <div
        style={{
          paddingLeft: "12px",
          paddingRight: "12px",
          display: "inline-block"
        }}
      >
        <Button
          onClick={() => {
            if (pendingRules && selected) {
              mergePendingRules([...pendingRules, selected]);
            } else if (selected) {
              console.log(selected);
              mergePendingRules([selected]);
            }
          }}
        >
          Add a rule
        </Button>
      </div>
    </div>
  );
};
