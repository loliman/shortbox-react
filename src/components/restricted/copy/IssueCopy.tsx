import React from "react";
import Layout from "../../Layout";
import { useQuery } from "@apollo/client";
import { createIssue } from "../../../graphql/mutationsTyped";
import { issue } from "../../../graphql/queriesTyped";
import { withContext } from "../../generic";
import QueryResult from "../../generic/QueryResult";
import IssueEditor from "../editor/IssueEditor";

function IssueCopy(props) {
  const { selected } = props;
  let variables = { ...selected, edit: true };
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

        let defaultValues = JSON.parse(JSON.stringify(data.issue));

        defaultValues.variants = undefined;
        defaultValues.variant = "";
        defaultValues.isbn = "";
        defaultValues.verified = undefined;
        defaultValues.collected = undefined;
        defaultValues.createdAt = undefined;
        defaultValues.updatedAt = undefined;
        defaultValues.cover = defaultValues.cover ? defaultValues.cover : "";
        defaultValues.pages = defaultValues.pages ? defaultValues.pages : 0;
        defaultValues.comicguideid = defaultValues.comicguideid ? defaultValues.comicguideid : 0;
        defaultValues.limitation = defaultValues.limitation ? defaultValues.limitation : 0;
        defaultValues.stories = [];
        defaultValues.individuals = [];
        defaultValues.arcs = [];
        defaultValues.covers = [];
        defaultValues.cover = undefined;
        defaultValues.features = [];

        return <IssueEditor copy mutation={createIssue} defaultValues={defaultValues} />;
      })()}
    </Layout>
  );
}

export default withContext(IssueCopy);
