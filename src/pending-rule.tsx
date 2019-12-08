import React, { useState, useCallback } from "react";
import {
  Card,
  Form,
  FormLayout,
  RangeSlider,
  ButtonGroup,
  Button,
  ChoiceList
} from "@shopify/polaris";

import { ExclusivityRule, EXCLUSIVITY_APPROVED } from "./layout";
import { ShopifyProduct } from "./mocks/mockProducts";

export const PendingRule: React.FC<{
  rule: ExclusivityRule;
  product: ShopifyProduct;
  updateRule: Function;
  destroyRule: Function;
}> = ({ rule, product, updateRule, destroyRule }) => {
  const [subscriberDuration, setSubscriberDuration] = useState(0);
  const [tierRequirement, setTierRequirement] = useState([]);
  const handleChange = useCallback(value => setTierRequirement(value), []);

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            src={product.featuredImage}
            alt="smiley-face"
            style={{ maxWidth: "200px", minWidth: "200px" }}
          />
          <div style={{ display: "flex" }}>
            <p> {product.title}</p>
          </div>
        </div>
        <div style={{ paddingTop: "24px", paddingBottom: "24px" }}>
          <Form onSubmit={() => console.log("submitted")}>
            <FormLayout>
              <RangeSlider
                value={subscriberDuration}
                label="Minimum subscriber period (in months)"
                min={0}
                max={24}
                output
                onChange={val => {
                  console.log("Rangeslider value", val);
                  if (typeof val === "number") {
                    setSubscriberDuration(val);
                  }
                }}
              />
              <ChoiceList
                allowMultiple
                onChange={handleChange}
                selected={tierRequirement}
                title="Tiers that can access the item"
                choices={[
                  {
                    label: "Tier One",
                    value: "1"
                  },
                  {
                    label: "Tier Two",
                    value: "2"
                  },
                  {
                    label: "Tier Three",
                    value: "3"
                  }
                ]}
              ></ChoiceList>
            </FormLayout>
            <div style={{ paddingTop: "12px" }}>
              <ButtonGroup>
                <Button destructive onClick={() => destroyRule(product.id)}>
                  Delete Rule
                </Button>
                <Button
                  primary
                  onClick={() =>
                    updateRule({
                      ...rule,
                      tierRequirement,
                      subscriberDuration,
                      platform: "twitch",
                      status: EXCLUSIVITY_APPROVED
                    })
                  }
                >
                  Save Rule
                </Button>
              </ButtonGroup>
            </div>
          </Form>
        </div>
      </div>
    </Card>
  );
};
