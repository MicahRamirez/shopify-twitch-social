import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  FormLayout,
  RangeSlider,
  Subheading
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
}> = ({ rule }) => {
  const [subscriberLength, setSubscriberLength] = useState(0);
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
        <div>
          <Form onSubmit={() => console.log("submitted")}>
            <FormLayout>
              <Subheading>Minimum Subscriber Period</Subheading>
              <RangeSlider
                value={subscriberLength}
                label="Minimum Subscriber Period (Months)"
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
              <RangeSlider
                value={subscriberLength}
                label="Minimum Subscriber Period (Months)"
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
              <RangeSlider
                value={subscriberLength}
                label="Minimum Subscriber Period (Months)"
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
              <RangeSlider
                value={subscriberLength}
                label="Minimum Subscriber Period (Months)"
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
            </FormLayout>
          </Form>
        </div>
      </div>
    </Card>
  );
};
