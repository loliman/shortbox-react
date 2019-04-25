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

                    return (
                        <PublisherEditor edit
                                         mutation={editPublisher}
                                         defaultValues={data.publisher}
                        />
                    );
                }}
            </Query>
        </Layout>
    )
}
export default withContext(PublisherEdit);