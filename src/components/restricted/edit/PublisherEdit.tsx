import React from "react";
import Layout from "../../Layout";
import { useQuery } from "@apollo/client";
import { editPublisher } from "../../../graphql/mutationsTyped";
import { publisher } from "../../../graphql/queriesTyped";
import { withContext } from "../../generic";
import QueryResult from "../../generic/QueryResult";
import PublisherEditor from "../editor/PublisherEditor";
import type { SelectedRoot } from "../../../types/domain";

interface PublisherEditProps {
  selected: SelectedRoot;
}

function PublisherEdit(props: Readonly<PublisherEditProps>) {
  const { selected } = props;
  const { loading, error, data } = useQuery(publisher, { variables: selected as any });

  return (
    <Layout>
      {(() => {
        if (loading || error || !data || !data.publisher)
          return (
            <QueryResult
              loading={loading}
              error={error}
              data={data ? data.publisher : null}
              selected={selected}
            />
          );

        let defaultValues = structuredClone(data.publisher) as Record<string, unknown>;

        defaultValues.seriesCount = undefined;
        defaultValues.issueCount = undefined;
        defaultValues.active = undefined;
        defaultValues.firstIssue = undefined;
        defaultValues["lastEdited"] = undefined;
        defaultValues.lastIssue = undefined;

        return (
          <PublisherEditor
            edit
            id={data.publisher.id}
            mutation={editPublisher}
            defaultValues={defaultValues}
          />
        );
      })()}
    </Layout>
  );
}
export default withContext(PublisherEdit);
