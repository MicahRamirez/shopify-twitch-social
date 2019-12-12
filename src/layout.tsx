import React, { useState, useCallback } from "react";
import { Layout, Card, Heading, SkeletonPage, Button } from "@shopify/polaris";
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

const CardOne = ({ onClick }: { onClick: () => void }) => {
  return (
    <Layout.Section>
      <Card sectioned>
        <p>
          The layout component should: Use sections with white backgrounds for
          primary content and sections with grey backgrounds for secondary
          content that is less important Center cards on the background when
          there is no secondary card on the page to stop the content from
          becoming too wide Group similar concepts and actions together in cards
          Separate different cards using a full-width divider Structure
          primary/secondary, two-column layouts so the primary ⅔ section is used
          for main information and the secondary ⅓ section is used for
          information that might not be used as often but remains helpful for
          context or secondary tasks Use equal-width layouts with two or more
          columns when each layout section has the same importance
        </p>
        <Button onClick={onClick}>Create a rule</Button>
      </Card>
    </Layout.Section>
  );
};

const CardTwo = ({ onClick }: { onClick: () => void }) => {
  return (
    <Layout.Section>
      <Card sectioned>
        <p>
          The layout component should: Use sections with white backgrounds for
          primary content and sections with grey backgrounds for secondary
          content that is less important Center cards on the background when
          there is no secondary card on the page to stop the content from
          becoming too wide Group similar concepts and actions together in cards
        </p>
        <Button onClick={onClick}>Start rule workflow</Button>
      </Card>
    </Layout.Section>
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
  const [newRuleCreated, setNewRuleCreated] = useState(false);
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
        <CardOne onClick={flipAnimationManager} />
      </animated.div>
    ),
    ({ style }: any) => (
      <animated.div style={style}>
        <CardTwo onClick={flipAnimationManager} />
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
  console.log("newRuleCreated value", newRuleCreated);
  return (
    <SkeletonPage title="Exclusivity Rules">
      <Layout>
        <Button onClick={() => setNewRuleCreated(!newRuleCreated)}>
          Flip flag
        </Button>
        {transitions.map(({ item, props, key }) => {
          const Component = pages[item];
          return <Component key={key} style={props} />;
        })}
        {approvedRules.length > 0 && (
          <Layout.Section>
            <ApprovedRuleDisplay
              rules={approvedRules}
              ruleMap={ruleMap}
              productMap={productMap}
            />
          </Layout.Section>
        )}
        <Layout.Section secondary>
          <Card sectioned>
            <Heading>Add new exclusivity rules.</Heading>
            <Button onClick={() => console.log("animate")}>Add a rule</Button>
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
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};
