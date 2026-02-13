import React from "react";
import Layout from "../../Layout";
import { useQuery } from "@apollo/client";
import { editIssue } from "../../../graphql/mutationsTyped";
import { issue } from "../../../graphql/queriesTyped";
import { withContext } from "../../generic";
import QueryResult from "../../generic/QueryResult";
import IssueEditor from "../editor/IssueEditor";
import { mapIssueToEditorDefaultValues } from "../editor/issue-editor/defaultValues";
import type { SelectedRoot } from "../../../types/domain";

interface IssueEditProps {
  selected: SelectedRoot;
}

function IssueEdit(props: Readonly<IssueEditProps>) {
  const { selected } = props;
  const variables = { ...selected, edit: true };
  const { loading, error, data } = useQuery(issue, { variables: variables as any });

  return (
    <Layout>
      {(() => {
        if (loading || error || !data || !data.issue)
          return (
            <QueryResult
              loading={loading}
              error={error}
              data={data ? data.issue : null}
              selected={selected}
            />
          );

        const defaultValues = mapIssueToEditorDefaultValues(data.issue, false);

        return (
          <IssueEditor id={data.issue.id} edit mutation={editIssue} defaultValues={defaultValues} />
        );
      })()}
    </Layout>
  );
}

export default withContext(IssueEdit);
