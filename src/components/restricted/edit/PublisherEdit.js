import React from 'react'
import Layout from "../../Layout";
import {Query} from "react-apollo";
import {editPublisher} from "../../../graphql/mutations";
import {publisher} from "../../../graphql/queries";
import {withContext} from "../../generic";
import QueryResult from "../../generic/QueryResult";
import PublisherEditor from "../editor/PublisherEditor";

function PublisherEdit(props) {
    const {selected} = props;

    return (
        <Layout>
            <Query query={publisher} variables={selected}>
                {({loading, error, data}) => {
                    if (loading || error || !data.publisher)
                        return <QueryResult loading={loading} error={error} data={data ? data.publisher : null} selected={selected}/>;

                    let defaultValues = JSON.parse(JSON.stringify(data.publisher));

                    defaultValues.seriesCount = undefined;
                    defaultValues.issueCount = undefined;
                    defaultValues.active = undefined;
                    defaultValues.firstIssue = undefined;
                    defaultValues.lastEdited = undefined;
                    defaultValues.lastIssue = undefined;

                    return (
                        <PublisherEditor edit
                                         mutation={editPublisher}
                                         defaultValues={defaultValues}
                        />
                    );
                }}
            </Query>
        </Layout>
    )
}
export default withContext(PublisherEdit);