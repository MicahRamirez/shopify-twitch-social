import React, { useState } from "react";
import { Layout, Card, Heading } from "@shopify/polaris";
import { CreateExclusivityRule, ExclusivityRule } from "./exclusivity-select";
import { PendingRule } from "./pending-rule";

const ApprovedRulesDisplay: React.FC<{
  approvedRules: ExclusivityRule[];
}> = ({ approvedRules }) => {
  console.log(approvedRules);
  return (
    <Card>
      {approvedRules.map(approvedRule => {
        return <div>{approvedRule.label}</div>;
      })}
    </Card>
  );
};

/**
 * Dropdown with all listed items in the store,
 * on select add a new entry for a rule
 */
export const LayoutComponent: React.FC<{}> = _ => {
  // used to hold rules that the user in attempting to configure for exclusivity
  // in order from a rule to move from this set to Shopify Metadata Store
  // the user needs to confirm their validity
  const [pendingRules, mergePendingRules] = useState<ExclusivityRule[]>();
  const [approvedRules, setApprovedRules] = useState<ExclusivityRule[]>([]);
  const handleRuleApproval = (approvedRule: ExclusivityRule) => {
    if (!pendingRules) {
      console.log("cant approve what DNE");
      return {};
    }
    // invariant THIS RULE CANNOT ALREADY EXIST IN THE APPROVED RULE LIST
    return {
      newPendingRules: pendingRules.filter(
        pendingRule => pendingRule.value !== approvedRule.value
      ),
      newApprovedRules: [...approvedRules, approvedRule]
    };
  };
  return (
    <Layout>
      <Layout.AnnotatedSection
        title="Rules"
        description="Create new or update existing rules to make your merch exclusive!"
      >
        <Card title="Select a product to add an exclusivity rule.">
          <CreateExclusivityRule
            key={`${pendingRules ? pendingRules.length : "default"}`}
            pendingRules={pendingRules}
            mergePendingRules={mergePendingRules}
          />
        </Card>
        {pendingRules && (
          <div style={{ paddingTop: "24px", paddingBottom: "12px" }}>
            <Heading>Pending Rules</Heading>
          </div>
        )}
        {pendingRules &&
          pendingRules.map((rule, key) => (
            <PendingRule
              key={key}
              rule={rule}
              setApprovedRules={setApprovedRules}
              setPendingRules={mergePendingRules}
              handleRuleApproval={handleRuleApproval}
            />
          ))}
        {approvedRules && (
          <div style={{ paddingTop: "24px", paddingBottom: "12px" }}>
            <Heading>Approved Rules </Heading>
          </div>
        )}
        {approvedRules && (
          <ApprovedRulesDisplay approvedRules={approvedRules} />
        )}
      </Layout.AnnotatedSection>
      <Layout.Section></Layout.Section>
    </Layout>
  );
};
