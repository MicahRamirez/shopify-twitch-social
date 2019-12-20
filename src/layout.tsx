import React, { useState } from "react";
import { Layout, SkeletonPage } from "@shopify/polaris";
import { ShopifyProduct } from "./mocks/mockProducts";

import { ApprovedRuleDisplay } from "./approved-rule";
import { CreateRuleWorkflow } from "./create-rule-workflow";

export const EXCLUSIVITY_APPROVED = "approved";
export const EXCLUSIVITY_PENDING = "pending";

export interface ExclusivityRule {
  tierRequirement: string;
  subscriberDuration?: number;
  platform?: string;
  productId: string;
  status: "pending" | "approved";
}

/**
 * Dropdown with all listed items in the store,
 * on select add a new entry for a rule
 */
export const LayoutComponent: React.FC<{
  shopifyProducts: ShopifyProduct[];
}> = ({ shopifyProducts }) => {
  // to eventually pull from shopify product list
  const products = shopifyProducts;
  // uuid to shopify product model
  const productMap = products.reduce<{ [key: string]: ShopifyProduct }>(
    (acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr
      };
    },
    {}
  );

  // used to hold rules that the user in attempting to configure for exclusivity
  // in order from a rule to move from this set to Shopify Metadata Store
  // the user needs to confirm their validity
  const [exclusivityRules, setExclusivityRules] = useState<ExclusivityRule[]>(
    []
  );
  const productIdsWithExclusivityRules = exclusivityRules.reduce(
    (acc, curr) => ({ ...acc, ...{ [curr.productId]: true } }),
    {}
  );

  const addNewRule = (productId: string) => {
    // rerenders the whole page?
    setExclusivityRules([
      ...exclusivityRules,
      {
        status: EXCLUSIVITY_PENDING,
        productId: productId,
        tierRequirement: "0"
      }
    ]);
  };

  const updateRule = (updatedRule: ExclusivityRule) => {
    const updatedSet = exclusivityRules.filter(
      rule => rule.productId !== updatedRule.productId
    );
    updatedSet.push(updatedRule);
    setExclusivityRules(updatedSet);
  };
  // may need to memo this
  const productsWithoutRules = products.filter(
    product => !(product.id in productIdsWithExclusivityRules)
  );

  const approvedRules = exclusivityRules.filter(
    rule => rule.status === EXCLUSIVITY_APPROVED
  );

  const pendingRules = exclusivityRules.filter(
    rule => rule.status === EXCLUSIVITY_PENDING
  );

  const ruleMap = approvedRules.reduce<{
    [key: string]: ExclusivityRule;
  }>((acc, curr) => {
    return {
      ...acc,
      [curr.productId]: curr
    };
  }, {});

  const destroyRule = (ruleId: string) => {
    setExclusivityRules(
      exclusivityRules.filter(rule => rule.productId !== ruleId)
    );
  };

  // so when there are existing rules prioritize seeing them displayed in the main column
  // side panel for adding additional rules
  return (
    <SkeletonPage title="Exclusivity Rules">
      <Layout>
        <Layout.Section>
          <ApprovedRuleDisplay
            rules={approvedRules}
            ruleMap={ruleMap}
            productMap={productMap}
          />
        </Layout.Section>
        <Layout.Section>
          <CreateRuleWorkflow
            pendingRules={pendingRules}
            addNewRule={addNewRule}
            productsWithoutRules={productsWithoutRules}
            productMap={productMap}
            updateRule={updateRule}
            destroyRule={destroyRule}
          />
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};
