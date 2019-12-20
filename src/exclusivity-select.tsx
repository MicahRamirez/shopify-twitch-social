import React, { useState } from "react";
import { Select, Button } from "@shopify/polaris";
import { ShopifyProduct } from "./mocks/mockProducts";

export const CreateExclusivityRule: React.FC<{
  addNewRule: Function;
  products: ShopifyProduct[];
}> = ({ addNewRule, products }) => {
  // generate mock items once
  const [selectValue, setSelectValue] = useState();
  // probably need to memo
  const options = products.map(({ id, title }) => ({
    value: id,
    label: title
  }));
  console.log(options);
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
          paddingLeft: "12px",
          maxWidth: "350px"
        }}
      >
        <Select
          options={options}
          label="Add a new exclusivity rule"
          placeholder="Select a product"
          value={selectValue}
          onChange={val => {
            // the select requires the VALUE in the options, DUH
            setSelectValue(val);
          }}
        />
      </div>
      <div
        style={{
          paddingLeft: "12px",
          paddingRight: "12px",
          display: "inline-block",
          paddingTop: "12px"
        }}
      >
        <Button
          onClick={() => {
            addNewRule(selectValue);
          }}
        >
          Add a rule
        </Button>
      </div>
    </div>
  );
};
