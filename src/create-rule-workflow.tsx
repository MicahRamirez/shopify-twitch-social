import React, { useState, useCallback, useEffect } from "react";
import { Card, CalloutCard } from "@shopify/polaris";
import { useTransition, animated } from "react-spring";

import { CreateExclusivityRule } from "./exclusivity-select";
import { PendingRule } from "./pending-rule";
import { ShopifyProduct } from "./mocks/mockProducts";
import { ExclusivityRule } from "./layout";

export const CreateRuleWorkflow = ({
  pendingRules,
  addNewRule,
  productsWithoutRules,
  productMap,
  updateRule,
  destroyRule
}: {
  pendingRules: ExclusivityRule[];
  addNewRule: Function;
  productsWithoutRules: ShopifyProduct[];
  productMap: { [productId: string]: ShopifyProduct };
  updateRule: Function;
  destroyRule: Function;
}) => {
  const [index, set] = useState(0);
  const onClick = useCallback(() => {
    set(i => i + (1 % 2));
  }, []);
  const workflowPages = [
    ({ style }: any) => (
      <animated.div style={style}>
        <CalloutCard
          title="Create an exclusivity rule to make exclusive merch!"
          illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
          primaryAction={{
            onAction: onClick,
            content: "Create rule"
          }}
        ></CalloutCard>
      </animated.div>
    ),
    ({ style }: any) => (
      <animated.div style={style}>
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
      </animated.div>
    )
  ];
  useEffect(() => {
    setImmediate(false);
  }, []);
  const [immediate, setImmediate] = useState(true);

  const transitions = useTransition(index, p => p, {
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
    immediate: immediate
  });
  return (
    <>
      {transitions.map(({ item, props, key }) => {
        // determines layout skeleton
        const Component = workflowPages[item];
        return <Component key={key} style={props} />;
      })}
    </>
  );
};
