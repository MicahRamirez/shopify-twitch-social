import React, { useState } from "react";
import { Select, Layout, Card, Button } from "@shopify/polaris";

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
    id: "1",
    onlineStoreUrl: "someUrl",
    title: "Tenga"
  }
];

interface ExclusivityRule {}

/**
 * Dropdown with all listed items in the store,
 * on select add a new entry for a rule
 *
 */
export const LayoutComponent: React.FC<{}> = _ => {
  // used to hold rules that the user in attempting to configure for exclusivity
  // in order from a rule to move from this set to Shopify Metadata Store
  // the user needs to confirm their validity
  const [pendingRules, mergePendingRules] = useState<ExclusivityRule[]>();
  return (
    <Layout>
      <Layout.Section>
        <Card title="Select a product to add an exclusivity rule.">
          <CreateExclusivityRule
            pendingRules={pendingRules}
            mergePendingRules={mergePendingRules}
          />
        </Card>
      </Layout.Section>
    </Layout>
  );
};

interface RuleOptions {
  // an option must have a label and id
  label: string;
  id: string;
  // it can have other properties that we want to maintain as well
  [x: string]: string;
}

const CreateExclusivityRule: React.FC<{
  mergePendingRules: Function;
  pendingRules: ExclusivityRule[] | undefined;
}> = ({ mergePendingRules, pendingRules }) => {
  const [selected, setSelected] = useState<RuleOptions>();
  // probably need to memo
  const options = MOCK_ITEMS.map(({ id, title, ...rest }) => ({
    ...{ value: id, label: title },
    ...rest
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
          onChange={val => {
            console.log(val);
            setSelected({ label: val, id: val });
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
            } else {
              mergePendingRules(selected);
            }
          }}
        >
          Add a rule
        </Button>
      </div>
    </div>
  );
};
