import React from "react";
import Layout from "../../Layout";
import { createIssue } from "../../../graphql/mutationsTyped";
import { withContext } from "../../generic";
import IssueEditor from "../editor/IssueEditor";
import { buildIssueCreateDefaultValues } from "../editor/issue-editor/defaultValues";
import type { HierarchyLevelType } from "../../../util/hierarchy";
import type { SelectedRoot } from "../../../types/domain";

interface IssueCreateProps {
  selected: SelectedRoot;
  level: HierarchyLevelType;
}

function IssueCreate(props: Readonly<IssueCreateProps>) {
  const { selected, level } = props;
  const defaultValues = buildIssueCreateDefaultValues(selected as any, level);

  return (
    <Layout>
      <IssueEditor mutation={createIssue} defaultValues={defaultValues} />
    </Layout>
  );
}

export default withContext(IssueCreate);
