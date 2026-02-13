import React from "react";
import Layout from "../../Layout";
import { useQuery } from "@apollo/client";
import { editSeries } from "../../../graphql/mutationsTyped";
import { seriesd } from "../../../graphql/queriesTyped";
import { withContext } from "../../generic";
import QueryResult from "../../generic/QueryResult";
import SeriesEditor from "../editor/SeriesEditor";

function SeriesEdit(props) {
  const { selected } = props;
  const { loading, error, data } = useQuery(seriesd, { variables: selected });

  return (
    <Layout>
      {(() => {
        if (loading || error || !data || !data.seriesd)
          return (
            <QueryResult
              loading={loading}
              error={error}
              data={data ? data.seriesd : null}
              selected={selected}
            />
          );

        let defaultValues = structuredClone(data.seriesd) as Record<string, unknown>;

        defaultValues.issueCount = undefined;
        defaultValues.active = undefined;
        defaultValues.firstIssue = undefined;
        defaultValues["lastEdited"] = undefined;
        defaultValues.lastIssue = undefined;

        return (
          <SeriesEditor
            edit
            id={data.seriesd.id}
            mutation={editSeries}
            defaultValues={defaultValues}
          />
        );
      })()}
    </Layout>
  );
}

export default withContext(SeriesEdit);
