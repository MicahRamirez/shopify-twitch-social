import React, { useState } from "react";
import { Layout, Card, Heading } from "@shopify/polaris";
import { CreateExclusivityRule, ExclusivityRule } from "./exclusivity-select";
import { PendingRule } from "./pending-rule";

/**
 * Dropdown with all listed items in the store,
 * on select add a new entry for a rule
 */
export const LayoutComponent: React.FC<{}> = _ => {
  // used to hold rules that the user in attempting to configure for exclusivity
  // in order from a rule to move from this set to Shopify Metadata Store
  // the user needs to confirm their validity
  const [pendingRules, mergePendingRules] = useState<ExclusivityRule[]>();
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
        {pendingRules && <Heading>Approve pending rules</Heading>}
        {pendingRules && pendingRules.map(rule => <PendingRule rule={rule} />)}
      </Layout.AnnotatedSection>
      <Layout.Section></Layout.Section>
    </Layout>
  );
};
