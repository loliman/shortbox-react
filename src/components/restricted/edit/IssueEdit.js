import React from 'react'
import Layout from "../../Layout";
import {Query} from "react-apollo";
import {editIssue} from "../../../graphql/mutations";
import {issue} from "../../../graphql/queries";
import {withContext} from "../../generic";
import QueryResult from "../../generic/QueryResult";
import IssueEditor from "../editor/IssueEditor";

function IssueEdit(props) {
    const {selected} = props;

    return (
        <Layout>
            <Query query={issue} variables={selected}>
                {({loading, error, data}) => {
                    if (loading || error || !data.issue)
                        return <QueryResult loading={loading} error={error} data={data.issue} selected={selected}/>;

                    return (
                        <IssueEditor edit
                                      mutation={editIssue}
                                      defaultValues={data.issue}
                        />
                    );
                }}
            </Query>
        </Layout>
    )
}

export default withContext(IssueEdit);