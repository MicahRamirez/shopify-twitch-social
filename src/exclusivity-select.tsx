import React, { useState } from "react";
import { Select, Button } from "@shopify/polaris";

const MOCK_ITEMS = [
  {
    id: "1",
    onlineStoreUrl: "someUrl",
    title: "Hat"
  },
  {
    id: "2",
    onlineStoreUrl: undefined,
    title: "Mug"
  },
  {
    id: "3",
    onlineStoreUrl: "someUrl",
    title: "Tshirt"
  },
  {
    id: "4",
    onlineStoreUrl: "someUrl",
    title: "Tenga"
  }
];

interface RuleOptions {
  // an option must have a label and id
  label: string;
  value: string;
  // it can have other properties that we want to maintain as well
  [x: string]: string;
}

export interface ExclusivityRule {
  label: string;
  value: string;
}

export const CreateExclusivityRule: React.FC<{
  mergePendingRules: Function;
  pendingRules: ExclusivityRule[] | undefined;
}> = ({ mergePendingRules, pendingRules }) => {
  const [selected, setSelected] = useState<RuleOptions>();
  // probably need to memo
  const options = MOCK_ITEMS.map(({ id, title }) => ({
    value: id,
    label: title
  }));
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
          value={selected && selected.value}
          onChange={val => {
            // idx into the arr
            const { label, value } = options[parseInt(val) - 1];
            setSelected({
              label,
              value
            });
          }}
        ></Select>
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
            if (pendingRules) {
              mergePendingRules([...pendingRules, selected]);
            } else if (selected) {
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
