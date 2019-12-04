import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Form,
  FormLayout,
  RangeSlider,
  ButtonGroup,
  Button,
  ChoiceList
} from "@shopify/polaris";

const testImagePaths: { [numberIdx: number]: string } = {
  0: "/test_image_one.png",
  1: "/test_image_two.png",
  2: "/test_image_three.png"
};

const randomIntInRange = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const PendingRule: React.FC<{
  rule: { label: string; value: string };
  setApprovedRules: Function;
  setPendingRules: Function;
  handleRuleApproval: Function;
}> = ({ rule, handleRuleApproval, setApprovedRules, setPendingRules }) => {
  const [subscriberLength, setSubscriberLength] = useState(0);
  const [subscriberTier, setSubscriberTier] = useState([]);
  const handleChange = useCallback(value => setSubscriberTier(value), []);

  // todo REMOVE
  const [ruleRandomNum, setRuleRandomNum] = useState();
  useEffect(() => {
    setRuleRandomNum(randomIntInRange(3));
  }, []);

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
          <img src={testImagePaths[ruleRandomNum]} alt="smiley-face" />
          <div style={{ display: "flex" }}>
            <p> {rule.label}</p>
          </div>
        </div>
        <div style={{ paddingTop: "24px", paddingBottom: "24px" }}>
          <Form onSubmit={() => console.log("submitted")}>
            <FormLayout>
              <RangeSlider
                value={subscriberLength}
                label="Minimum subscriber period (in months)"
                min={0}
                max={24}
                output
                onChange={val => {
                  console.log("Rangeslider value", val);
                  if (typeof val === "number") {
                    setSubscriberLength(val);
                  }
                }}
              />
              <ChoiceList
                allowMultiple
                onChange={handleChange}
                selected={subscriberTier}
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
                <Button
                  destructive
                  onClick={() => console.log("destructive clicked")}
                >
                  Delete Rule
                </Button>
                <Button
                  primary
                  onClick={() => {
                    const {
                      newPendingRules,
                      newApprovedRules
                    } = handleRuleApproval(rule);
                    setPendingRules(newPendingRules);
                    setApprovedRules(newApprovedRules);
                  }}
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
