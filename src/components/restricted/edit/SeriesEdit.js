import React from 'react'
import Layout from "../../Layout";
import {Query} from "react-apollo";
import {editSeries} from "../../../graphql/mutations";
import {seriesd} from "../../../graphql/queries";
import {withContext} from "../../generic";
import QueryResult from "../../generic/QueryResult";
import SeriesEditor from "../editor/SeriesEditor";

function SeriesEdit(props) {
    const {selected} = props;

    return (
        <Layout>
            <Query query={seriesd} variables={selected}>
                {({loading, error, data}) => {
                    if (loading || error || !data.seriesd)
                        return <QueryResult loading={loading} error={error} data={data ? data.seriesd : null} selected={selected}/>;

                    let defaultValues = JSON.parse(JSON.stringify(data.seriesd));

                    defaultValues.issueCount = undefined;
                    defaultValues.active = undefined;
                    defaultValues.firstIssue = undefined;
                    defaultValues.lastEdited = undefined;
                    defaultValues.lastIssue = undefined;

                    return (
                        <SeriesEditor edit
                                      mutation={editSeries}
                                      defaultValues={defaultValues}
                        />
                    );
                }}
            </Query>
        </Layout>
    )
}

export default withContext(SeriesEdit);