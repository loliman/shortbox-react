import React from "react";
import Layout from "../../Layout";
import { createIssue } from "../../../graphql/mutationsTyped";
import { withContext } from "../../generic";
import IssueEditor from "../editor/IssueEditor";
import { buildIssueCreateDefaultValues } from "../editor/issue-editor/defaultValues";

function IssueCreate(props) {
  const { selected, level } = props;
  const defaultValues = buildIssueCreateDefaultValues(selected, level);

  return (
    <Layout>
      <IssueEditor mutation={createIssue} defaultValues={defaultValues} />
    </Layout>
  );
}

export default withContext(IssueCreate);
