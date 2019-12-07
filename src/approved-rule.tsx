import React, { useState } from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  Avatar,
  TextStyle,
  ResourceListSelectedItems
} from "@shopify/polaris";

import { ShopifyProduct } from "./mocks/mockProducts";
import { ExclusivityRule } from "./layout";

export const ApprovedRuleDisplay: React.FC<{
  productMap: { [id: string]: ShopifyProduct };
  ruleMap: { [id: string]: ExclusivityRule };
  rules: ExclusivityRule[];
}> = ({ rules, productMap }) => {
  const renderItem = (rule: ExclusivityRule, _: any, index: number) => {
    const item = productMap[rule.productId];
    const media = (
      <Avatar name={item.title} source={item.featuredImage} size={"medium"} />
    );
    return (
      <ResourceItem
        id={item.id}
        media={media}
        sortOrder={index}
        onClick={() => console.log("clicking item", item.title)}
      >
        <h3>
          <TextStyle variation="strong">{name}</TextStyle>
        </h3>
        <div>{item.title}</div>
      </ResourceItem>
    );
  };
  const [selectedRules, setSelectedRules] = useState<ResourceListSelectedItems>(
    []
  );
  return (
    <Card>
      <ResourceList
        resourceName={{
          singular: "Exclusivity Rule",
          plural: "Exclusivity Rules"
        }}
        items={rules}
        renderItem={renderItem}
        selectedItems={selectedRules}
        onSelectionChange={rulesSelected => setSelectedRules(rulesSelected)}
        resolveItemId={itemId => itemId}
      />
    </Card>
  );
};
