import React from 'react'
import Layout from "../../Layout";
import {Query} from "react-apollo";
import {createIssue} from "../../../graphql/mutations";
import {issue} from "../../../graphql/queries";
import {withContext} from "../../generic";
import QueryResult from "../../generic/QueryResult";
import IssueEditor from "../editor/IssueEditor";

function IssueCopy(props) {
    const {selected} = props;
    let variables = selected;
    variables.edit = true;

    return (
        <Layout>
            <Query query={issue} variables={variables}>
                {({loading, error, data}) => {
                    if (loading || error || !data.issue)
                        return <QueryResult loading={loading} error={error} data={data ? data.issue : null} selected={selected}/>;

                    let defaultValues = JSON.parse(JSON.stringify(data.issue));

                    defaultValues.variants = undefined;
                    defaultValues.variant = '';
                    defaultValues.isbn = '';
                    defaultValues.verified = undefined;
                    defaultValues.collected = undefined;
                    defaultValues.createdAt = undefined;
                    defaultValues.updatedAt = undefined;
                    defaultValues.cover = defaultValues.cover ? defaultValues.cover : '';
                    defaultValues.pages = defaultValues.pages ? defaultValues.pages : 0;
                    defaultValues.comicguideid = defaultValues.comicguideid ? defaultValues.comicguideid : 0;
                    defaultValues.limitation = defaultValues.limitation ? defaultValues.limitation : 0;
                    defaultValues.stories = [];
                    defaultValues.individuals = [];
                    defaultValues.arcs = [];
                    defaultValues.covers = [];
                    defaultValues.cover = undefined;
                    defaultValues.features = [];

                    return (
                        <IssueEditor copy
                                     mutation={createIssue}
                                     defaultValues={defaultValues}
                        />
                    );
                }}
            </Query>
        </Layout>
    )
}

export default withContext(IssueCopy);
