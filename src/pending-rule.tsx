import React, { useState, useCallback } from "react";
import {
  Card,
  Form,
  FormLayout,
  RangeSlider,
  ButtonGroup,
  Button,
  Stack,
  RadioButton,
  Thumbnail
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
  const [tierValue, setTierValue] = useState<string>(rule.tierRequirement);
  const handleRadioChange = useCallback((_checked: any, newValue: string) => {
    setTierValue(newValue);
  }, []);

  return (
    <Card>
      <Form onSubmit={() => console.log("submitted")}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Thumbnail
              source={product && product.featuredImage}
              alt={product.title}
              size={"large"}
            />
            <div style={{ display: "flex" }}>
              <p> {product.title}</p>
            </div>
          </div>
          <div style={{ paddingTop: "24px", paddingBottom: "24px" }}>
            <FormLayout>
              <Stack vertical>
                <RadioButton
                  checked={tierValue === "0"}
                  label="Everyone"
                  helpText="Allows any user to purchase this product"
                  id="0"
                  name="free"
                  onChange={handleRadioChange}
                />
                <RadioButton
                  checked={tierValue === "1"}
                  label="Tier One"
                  helpText="Allows any subscriber to purchase this product"
                  id="1"
                  name="tier-one"
                  onChange={handleRadioChange}
                />
                <RadioButton
                  checked={tierValue === "2"}
                  label="Tier Two"
                  helpText="Allows tier two or higher subscriber to purchase this product"
                  id="2"
                  name="tier-two"
                  onChange={handleRadioChange}
                />
                <RadioButton
                  checked={tierValue === "3"}
                  label="Tier Three"
                  helpText="Allows any tier three subscriber to purchase this product"
                  id="3"
                  name="tier-three"
                  onChange={handleRadioChange}
                />
                {tierValue !== "0" && (
                  <RangeSlider
                    value={subscriberDuration}
                    label="Minimum subscriber period (in months)"
                    min={1}
                    max={24}
                    output
                    onChange={val => {
                      console.log("Rangeslider value", val);
                      if (typeof val === "number") {
                        setSubscriberDuration(val);
                      }
                    }}
                  />
                )}
              </Stack>
            </FormLayout>
          </div>
        </div>
        <div
          style={{
            paddingTop: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ButtonGroup>
            <Button destructive onClick={() => destroyRule(product.id)}>
              Delete Rule
            </Button>
            <Button
              primary
              onClick={() =>
                updateRule({
                  ...rule,
                  tierValue,
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
    </Card>
  );
};
