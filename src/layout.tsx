import React, { useState } from "react";
import { Layout, Card, Heading } from "@shopify/polaris";
import { CreateExclusivityRule } from "./exclusivity-select";
import { PendingRule } from "./pending-rule";
import { useEffect } from "react";
import {
  generateShopifyMockProducts,
  ShopifyProduct
} from "./mocks/mockProducts";
import { ApprovedRuleDisplay } from "./approved-rule";
import { GetProducts } from "./get-products";

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
export const LayoutComponent: React.FC<{}> = _ => {
  // to eventually pull from shopify product list
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  useEffect(() => {
    // when skip auth is defined we use mocks
    if (process.env.SKIP_AUTH) {
      setProducts(generateShopifyMockProducts(6));
    }
  }, []);
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

  const pendingRules = exclusivityRules.filter(
    rule => rule.status === EXCLUSIVITY_PENDING
  );

  const approvedRules = exclusivityRules.filter(
    rule => rule.status === EXCLUSIVITY_APPROVED
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
  return (
    <Layout>
      <GetProducts />
      <Layout.AnnotatedSection
        title="Rules"
        description="Create new or update existing rules to make your merch exclusive!"
      >
        <Card title="Select a product to add an exclusivity rule.">
          <CreateExclusivityRule
            key={`${pendingRules ? pendingRules.length : "default"}`}
            addNewRule={addNewRule}
            products={productsWithoutRules}
          />
        </Card>
        {pendingRules.length > 0 && (
          <div style={{ paddingTop: "24px", paddingBottom: "12px" }}>
            <Heading>Pending Rules</Heading>
          </div>
        )}
        {pendingRules.length > 0 &&
          pendingRules.map((rule, key) => (
            <PendingRule
              key={key}
              product={productMap[rule.productId]}
              rule={rule}
              updateRule={updateRule}
              destroyRule={destroyRule}
            />
          ))}
        {approvedRules.length > 0 && (
          <div style={{ paddingTop: "24px", paddingBottom: "12px" }}>
            <Heading>Approved Rules </Heading>
          </div>
        )}
        {approvedRules.length > 0 && (
          <ApprovedRuleDisplay
            rules={approvedRules}
            ruleMap={ruleMap}
            productMap={productMap}
          />
        )}
      </Layout.AnnotatedSection>
      <Layout.Section></Layout.Section>
    </Layout>
  );
};
