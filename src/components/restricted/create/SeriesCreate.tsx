import React from "react";
import Layout from "../../Layout";
import { createSeries } from "../../../graphql/mutationsTyped";
import { withContext } from "../../generic";
import SeriesEditor from "../editor/SeriesEditor";

function SeriesCreate() {
  return (
    <Layout>
      <SeriesEditor mutation={createSeries} />
    </Layout>
  );
}

export default withContext(SeriesCreate);
