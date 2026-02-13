import React from "react";
import Layout from "../../Layout";
import { useQuery } from "@apollo/client";
import { createIssue } from "../../../graphql/mutationsTyped";
import { issue } from "../../../graphql/queriesTyped";
import { withContext } from "../../generic";
import QueryResult from "../../generic/QueryResult";
import IssueEditor from "../editor/IssueEditor";
import { mapIssueToEditorDefaultValues } from "../editor/issue-editor/defaultValues";

function IssueCopy(props) {
  const { selected } = props;
  const variables = { ...selected, edit: true };
  const { loading, error, data } = useQuery(issue, { variables });

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

        const defaultValues = mapIssueToEditorDefaultValues(data.issue, true);

        return <IssueEditor copy mutation={createIssue} defaultValues={defaultValues} />;
      })()}
    </Layout>
  );
}

export default withContext(IssueCopy);
