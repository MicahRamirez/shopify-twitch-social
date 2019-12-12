import React, { useState } from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  Thumbnail,
  ResourceListSelectedItems,
  DescriptionList,
  Heading
} from "@shopify/polaris";

import { ShopifyProduct } from "./mocks/mockProducts";
import { ExclusivityRule } from "./layout";

const tierRequirementDescriptionMap: { [tierRequirement: string]: string } = {
  "0": "This product is available to all customers",
  "1": "This product is available to subscribers",
  "2": "This product is available to tier II subscribers and higher",
  "3": "This product is only available to tier III subscribers"
};

// // a tier is a very twitch centric concept
// const generateTierDescription = (rule: ExclusivityRule) => {
//   const description = "";
//   const tierSentences =
//     rule.tierRequirement && rule.tierRequirement.map(tier => tier);
// };

export const ApprovedRuleDisplay: React.FC<{
  productMap: { [id: string]: ShopifyProduct };
  ruleMap: { [id: string]: ExclusivityRule };
  rules: ExclusivityRule[];
}> = ({ rules, productMap }) => {
  const renderItem = (rule: ExclusivityRule, _: any, index: number) => {
    const item = productMap[rule.productId];
    const media = (
      <Thumbnail source={item.featuredImage} size={"large"} alt={item.title} />
    );
    return (
      <ResourceItem
        id={item.id}
        media={media}
        sortOrder={index}
        onClick={() => console.log("clicking item", item.title)}
      >
        <DescriptionList
          items={[
            {
              term: "Product Name",
              description: item.title
            },
            {
              term: "Available For Tier",
              description: `${
                tierRequirementDescriptionMap[rule.tierRequirement]
              }`
            },
            {
              term: "Minimum Subscriber Period",
              description: `The user must be subscribed for ${rule.subscriberDuration} months`
            }
          ]}
        />
      </ResourceItem>
    );
  };
  const [selectedRules, setSelectedRules] = useState<ResourceListSelectedItems>(
    []
  );
  return (
    <Card sectioned title="Approved Rules">
      <div style={{ paddingTop: "24px", paddingBottom: "12px" }}>
        <Heading>Approved Rules </Heading>
      </div>
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
