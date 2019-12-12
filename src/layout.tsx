import React, { useState, useCallback } from "react";
import { Layout, Card, SkeletonPage, Button } from "@shopify/polaris";
import { CreateExclusivityRule } from "./exclusivity-select";
import { PendingRule } from "./pending-rule";
import { ShopifyProduct } from "./mocks/mockProducts";
import { ApprovedRuleDisplay } from "./approved-rule";
import { useTransition, animated } from "react-spring";

export const EXCLUSIVITY_APPROVED = "approved";
export const EXCLUSIVITY_PENDING = "pending";

export interface ExclusivityRule {
  tierRequirement: string;
  subscriberDuration?: number;
  platform?: string;
  productId: string;
  status: "pending" | "approved";
}

const CreateRuleWorkflow = ({
  onClick,
  pendingRules,
  addNewRule,
  productsWithoutRules,
  productMap,
  updateRule,
  destroyRule
}: {
  onClick: () => void;
  pendingRules: ExclusivityRule[];
  addNewRule: Function;
  productsWithoutRules: ShopifyProduct[];
  productMap: { [productId: string]: ShopifyProduct };
  updateRule: Function;
  destroyRule: Function;
}) => {
  console.log(onClick);
  return (
    <Card sectioned title="Create an exclusivity rule">
      <CreateExclusivityRule
        key={`${pendingRules ? pendingRules.length : "default"}`}
        addNewRule={addNewRule}
        products={productsWithoutRules}
      />
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
    </Card>
  );
};

const MainPanel = ({
  onClick,
  approvedRules,
  ruleMap,
  productMap,
  pendingRules,
  addNewRule,
  productsWithoutRules,
  destroyRule,
  updateRule
}: {
  onClick: () => void;
  approvedRules: ExclusivityRule[];
  ruleMap: { [key: string]: ExclusivityRule };
  productMap: { [productKey: string]: ShopifyProduct };
  pendingRules: ExclusivityRule[];
  addNewRule: Function;
  productsWithoutRules: ShopifyProduct[];
  updateRule: Function;
  destroyRule: Function;
}) => {
  return (
    <Layout>
      <Layout.Section>
        <ApprovedRuleDisplay
          rules={approvedRules}
          ruleMap={ruleMap}
          productMap={productMap}
        />
      </Layout.Section>
      <Layout.Section secondary>
        <CreateRuleWorkflow
          onClick={onClick}
          pendingRules={pendingRules}
          addNewRule={addNewRule}
          productsWithoutRules={productsWithoutRules}
          productMap={productMap}
          updateRule={updateRule}
          destroyRule={destroyRule}
        />
      </Layout.Section>
    </Layout>
  );
};

const CreateRule = ({ onClick }: { onClick: () => void }) => {
  console.log(onClick);
  return (
    <Card title="Create a new rule">
      <Button onClick={onClick}>Create Rule</Button>
    </Card>
  );
};

const RuleCreationStep = ({ onClick }: { onClick: () => void }) => {
  return (
    <Layout>
      <Layout.Section>
        <CreateRule onClick={onClick} />
      </Layout.Section>
    </Layout>
  );
};

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
  const [index, set] = useState(0);
  // const externalDataAnimationManager = useCallback(() => {
  //   console.log("animation manager invoked");
  //   // new rule created, set the value to the idx of the original screen
  //   // example with an external data source
  //   if (newRuleCreated) {
  //     set(1);
  //   } else {
  //     set(0);
  //   }
  // }, [newRuleCreated]);
  const flipAnimationManager = useCallback(() => {
    set(index => (index + 1) % 2);
  }, []);
  const pages = [
    ({ style }: any) => (
      <animated.div style={style}>
        <MainPanel
          onClick={flipAnimationManager}
          approvedRules={approvedRules}
          ruleMap={ruleMap}
          productMap={productMap}
          productsWithoutRules={productsWithoutRules}
          addNewRule={addNewRule}
          pendingRules={pendingRules}
          updateRule={updateRule}
          destroyRule={destroyRule}
        />
      </animated.div>
    ),
    ({ style }: any) => (
      <animated.div style={style}>
        <RuleCreationStep onClick={flipAnimationManager} />
      </animated.div>
    )
  ];
  const transitions = useTransition(index, p => p, {
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" }
  });
  // so when there are existing rules prioritize seeing them displayed in the main column
  // side panel for adding additional rules
  return (
    <SkeletonPage title="Exclusivity Rules">
      <Layout>
        {transitions.map(({ item, props, key }) => {
          const Component = pages[item];
          return <Component key={key} style={props} />;
        })}
      </Layout>
    </SkeletonPage>
  );
};
